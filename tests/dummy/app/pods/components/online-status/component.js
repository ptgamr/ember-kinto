/* global navigator */
import Ember from 'ember';

export default Ember.Component.extend({
  onLine: true,
  onOnLine: Ember.K,

  didInsertElement() {
    this._super(...arguments);

    this.updateOnlineStatus();

    window.addEventListener('online',  () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  },

  updateOnlineStatus() {
    this.set('onLine', navigator.onLine);
    if (navigator.onLine) {
      Ember.run.later(this, function() {
        this.onOnLine();
      }, 500);
    }
  }
});

