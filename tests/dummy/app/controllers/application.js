import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    clearLocalData() {
      this.store.clearLocalData().then(() => {
        this.transitionToRoute('lists');
      });
    },

    _sync() {
      this.send('sync');
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
