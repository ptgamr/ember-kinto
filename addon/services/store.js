import Ember from 'ember';
import DS from 'ember-data';

export default DS.Store.extend({

  syncing: false,
  syncCollections: [],

  clearLocalData() {
    let promises = this.syncCollections.map(modelName => {
      return this.adapterFor(modelName).clear(modelName)
        .then(() => {
          return this.unloadAll(modelName);
        });
    });

    return Ember.RSVP.all(promises);
  },

  sync(modelName) {
    this.set('syncing', true);
    return this.adapterFor(modelName).sync(modelName).then(syncResult => {
      this._applyChangesToEmberDataStore(modelName, syncResult);
      this.set('syncing', false);
      Ember.Logger.debug('>>> store::sync completed');
    });
  },

  applyChanges(modelName, action, data) {
    return this.adapterFor(modelName).applyChanges(modelName, action, data).then(syncResult => {
      this._applyChangesToEmberDataStore(modelName, syncResult);
      Ember.Logger.debug('>>> store::syncIncomming completed');
    });
  },

  _applyChangesToEmberDataStore(modelName, syncResult) {
      syncResult.created.forEach(record => {
        this.pushPayload(modelName, {
          [modelName]: record
        });
      });

      syncResult.deleted.forEach(record => {
        this.findRecord(modelName, record.id, { backgroundReload: false }).then(instance => {
          if (instance) {
            instance.unloadRecord();
          }
        }).catch(() => {});
      });

      syncResult.updated.forEach(record => {
        this.pushPayload(modelName, {
          [modelName]: record.new
        });
      });

      syncResult.published.filter(record => !record.deleted).forEach(record => {
        this.pushPayload(modelName, {
          [modelName]: record
        });
      });
  }
});
