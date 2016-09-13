import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    clearLocalData() {
      this.store.clearLocalData().then(() => {
        this.transitionToRoute('lists');
      });
    },

    _sync() {
      this.send('sync');
    }
  }
});
