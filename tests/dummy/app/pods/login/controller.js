import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate(provider = 'github') {
      this.get('session').authenticate('authenticator:torii', provider)
        .catch((reason) => {
          this.set('errorMessage', reason.error || reason);
        });
    }
  }
});
