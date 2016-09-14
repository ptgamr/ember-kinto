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
  notes: attr(),

  list: belongsTo('list'),
  parentTask: belongsTo('task', { inverse: 'subTasks' }),
  subTasks: hasMany('task', { inverse: 'parentTask' }),

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
