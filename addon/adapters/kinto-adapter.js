import Ember from 'ember';
import DS from 'ember-data';

const {
  RSVP
} = Ember;

export default DS.Adapter.extend({

  db: null, // the Kinto instance, should be provided when extending this Adapter
  __collections: [], // the private cache of kinto's collections

  findRecord(store, type, id) {
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise(resolve => {
      collection
        .get(id)
        .then(existing => resolve({
          [this.modelName]: existing.data
        }))
        .catch(() => resolve());
    });
  },

  createRecord(store, type, snapshot) {

    let data = this.serialize(snapshot);
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection
        .create(data)
        .then(res => {
          resolve({ [type.modelName]: res.data });
        })
        .catch(err => {
          Ember.Logger.error('KintoAdapter:Error', err);
          reject(err);
        });
    });
  },

  updateRecord(store, type, snapshot) {

    let data = this.serialize(snapshot, { includeId: true });
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection
        .update(data)
        .then(res => {
          resolve({
            [type.modelName]: res.data
          });
        })
        .catch(err => {
          Ember.Logger.error('KintoAdapter:Error', err);
          reject(err);
        });
    });
  },

  deleteRecord(store, type, snapshot) {
    let id = snapshot.id;
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise((resolve) => {
      collection
        .delete(id)
        .then(res => {
          Ember.Logger.debug('delete success', res);
          resolve();
        })
        .catch(err => {
          Ember.Logger.debug('delete failed', err);
          // we do not want to reject here, because the record might no longer existed after kinto sync
          // reject(err);

          resolve();
        });
    });
  },

  findAll(store, type/*, sinceToken*/) {
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection
        .list()
        .then(res => {
          resolve({
            [this.pathForType(type.modelName)]: res.data
          });
        })
        .catch(err => {
          Ember.Logger.error('KintoAdapter:Error', err);
          reject(err);
        });
    });
  },

  query(store, type, query) {
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection
        .list(
          {
            filters: query
          }
        )
        .then(res => {
          resolve({
            [this.pathForType(type.modelName)]: res.data
          });
        })
        .catch(err => {
          Ember.Logger.error('KintoAdapter:Error', err);
          reject(err);
        });
    });
  },

  sync(modelName) {
    let collection = this.collectionForType(modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection.sync()
        .then(res => {
          Ember.Logger.debug('sync finished', res);
          resolve(res);
        })
        .catch(err => {
          Ember.Logger.debug('sync failed', err);
          reject(err);
        });
    });
  },

  applyChanges(modelName, action, data) {
    Ember.Logger.debug('ApplyChanges: ', modelName, action, data);

    let collection = this.collectionForType(modelName);

    // currently using SEVER_WIN strategy
    // TODO: CLIENT_WIN, MANUAL
    let localOperationPromises = data.map(record => {
      let result;
      switch (action) {
        case 'create':
          result = new RSVP.Promise(resolve => {
            collection.get(record.new.id)
              .then(existing => resolve(existing.data))
              .catch(() => {
                // record not found
                // this normally happend when the current user initiate the change (he also receive push message)
                collection.create(record.new, { synced: true }).then((newRecord) => resolve(newRecord.data));
              });
          });
          break;

        case 'update':
          result = collection.update(record.new, { synced: true }).then(() => record);
          break;

        case 'delete':
          result = new RSVP.Promise(resolve => {
            collection.get(record.new.id).then(existing => {
              collection.delete(existing.data.id).then(() => resolve(record.new));
            }).catch(() => {
              resolve(record.new);
            });
          });
          break;

        default:
          throw new Error('adapter::applyChanges: operation not supported');
      }

      return result;
    });

    return Ember.RSVP.all(localOperationPromises)
      .then(results => {
        let syncResult = {
          created: [],
          updated: [],
          deleted: [],
          conflicts: [],
          published: []
        };

        syncResult[`${action}d`] = results;

        return syncResult;
      });
  },

  collectionForType(modelName) {
    let collectionName = this.pathForType(modelName);
    let collection = this.__collections[collectionName];

    if (!collection) {
      collection = this.db.collection(collectionName);
      this.__collections[collectionName] = collection;
    }

    return collection;
  },

  pathForType(modelName) {
    let dasherize = Ember.String.dasherize(modelName);
    return Ember.String.pluralize(dasherize);
  }
});
