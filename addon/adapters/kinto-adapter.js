import Ember from 'ember';
import DS from 'ember-data';

export default DS.Adapter.extend({

  db: null,

  findRecord(store, type, id, snapshot) {
  },

  createRecord(store, type, snapshot) {

    let data = this.serialize(snapshot);
    let collection = this.db.collection(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection.create(data)
        .then(res => {
          resolve({ [type.modelName]: res.data });
        })
        .catch(err => reject(err));
    });
  },

  updateRecord(store, type, snapshot) {

    let data = this.serialize(snapshot, { includeId: true });
    let collection = this.db.collection(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection.update(data)
        .then(res => {
          console.log(res)
          resolve({
            [type.modelName]: res.data
          });
        })
        .catch(err => reject(err));
    });
  },

  deleteRecord(store, type, snapshot) {
    let id = snapshot.id;
    let collection = this.db.collection(type.modelName);

    return new Ember.RSVP.Promise((resolve) => {
      collection.delete(id)
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

  findAll(store, type, sinceToken) {

    let collection = this.db.collection(type.modelName);

    return new Ember.RSVP.Promise((resolve, reject) => {
      collection.list().then(res => {
        resolve({
          [type.modelName]: res.data
        });
      })
      .catch(err => {
        reject(err);
      });
    });
  },

  query() {
  },

  sync(modelName) {
    let collection = this.db.collection(modelName);
    return new Ember.RSVP.Promise((resolve, reject) => {
      collection.sync()
        .then(res => {
          Ember.Logger.info('sync finished', res);
          resolve(res);
        })
        .catch(err => {
          Ember.Logger.info('sync failed', err);
          reject(err);
        });
    });
  }
});
