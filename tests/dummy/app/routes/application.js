import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return new Ember.RSVP.Promise(resolve => {
      this.store.sync('task').then(resolve)
        .catch(resolve);
    });
  },

  model() {
    return this.get('store').findAll('task');
  }
});
