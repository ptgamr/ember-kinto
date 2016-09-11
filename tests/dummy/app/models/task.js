import DS from 'ember-data';

const {
  attr
} = DS;

export default DS.Model.extend({
  title: attr(),
  done: attr('boolean'),
  lastModified: attr(),
  sOrder: attr('number'),

  didUpdate() {
    this.store.sync('task');
  },

  didCreate() {
    this.store.sync('task');
  },

  didDelete() {
    this.store.sync('task');
  }
});
