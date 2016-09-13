import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return Ember.RSVP.Promise.all([
      this.store.sync('list'),
      this.store.sync('task'),
    ]);
  },

  afterModel(model, transition) {
    if(transition.targetName.indexOf('list') === -1) {
      return this.transitionTo('lists');
    }
  }
});
