import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.sync();
  },

  afterModel(model, transition) {
    if(transition.targetName.indexOf('list') === -1) {
      return this.transitionTo('lists');
    }
  },

  sync() {
    return Ember.RSVP.Promise.all([
      this.store.sync('list'),
      this.store.sync('task'),
    ]).catch(() => {});
  },

  actions: {
    sync() {
      this.sync();
    }
  }
});
