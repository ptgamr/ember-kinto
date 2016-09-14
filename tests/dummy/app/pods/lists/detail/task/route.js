import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate() {
    this.render({
      outlet: 'aside',
      into: 'lists'
    });
  },
  model(params) {
    return this.store.findRecord('task', params.taskId);
  }
});


