import DS from 'ember-data';

const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend({
  title: attr(),
  done: attr('boolean'),
  lastModified: attr(),
  sOrder: attr('number'),

  list: belongsTo('list'),
  subTasks: hasMany('task'),

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
