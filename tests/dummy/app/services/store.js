import DS from 'ember-data';

export default DS.Store.extend({
  sync(modelName) {
    return this.adapterFor(modelName).sync(modelName).then(syncResult => {
      syncResult.created.forEach(record => {
        this.pushPayload(modelName, {
          [modelName]: record
        });
      });

      syncResult.deleted.forEach(record => {
        this.findRecord(modelName, record.id, { backgroundReload: false }).then(instance => {
          instance.destroyRecord();
        });
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
    });
  }
});
