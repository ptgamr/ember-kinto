import Ember from 'ember';

export default Ember.Component.extend({
  task: null,
  onItemUpdate: Ember.K,
  onItemDelete: Ember.K,

  actions: {
    startEdit() {
      this.set('isEditing', true);
    },

    finishEdit() {
      this.set('isEditing', false);
      this.onItemUpdate(this.get('task'));
    },

    toggleDone(done) {
      let task = this.get('task');
      task.set('done', done);
      this.onItemUpdate(task);
    }
  }
});

