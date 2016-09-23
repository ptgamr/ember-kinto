import Ember from 'ember';
import DS from 'ember-data';
import SyncResultObject from './sync-result-object';

export default DS.Adapter.extend({

  db: null, // the Kinto instance, should be provided when extending this Adapter
  __collections: [], // the private cache of kinto's collections

  findRecord(store, type, id) {
    let collection = this.collectionForType(type.modelName);

    return new Ember.RSVP.Promise(resolve => {
      collection
        .get(id)
        .then(existing => {
          resolve({
            [type.modelName]: existing.data
          });
        })
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
      collection.sync({
        headers: {
          Authorization: this.get('authorizationHeader')
        }
      })
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
    let syncResultObject = new SyncResultObject();
    let changeObj = {
      changes: data.map(record => record.new)
    };
    changeObj.lastModified = Math.max(...changeObj.changes.map(record => record.last_modified));

    let collection = this.collectionForType(modelName);
    return collection.importChanges(syncResultObject, changeObj);
  },

  clear(modelName) {
    let collection = this.collectionForType(modelName);
    return collection.clear();
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
