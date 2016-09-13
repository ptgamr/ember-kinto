import Ember from 'ember';
import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

const {
  computed
} = Ember;

export default DS.Model.extend({
  name: attr(),
  sOrder: attr('number'),
  tasks: hasMany('task'),

  numberOfDoneTasks: computed('tasks.@each.done', {
    get() {
      return this.get('tasks').filterBy('done').get('length');
    }
  }),

  didUpdate() {
    this.store.sync('list');
  },

  didCreate() {
    this.store.sync('list');
  },

  didDelete() {
    this.store.sync('list');
  }
});

