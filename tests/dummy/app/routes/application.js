import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),
  // beforeModel() {
  //   return this.sync();
  // },

  afterModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
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
