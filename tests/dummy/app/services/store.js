import DS from 'ember-data';

export default DS.Store.extend({
  sync(modelName) {
    return this.adapterFor(modelName).sync(modelName);
  }
});
