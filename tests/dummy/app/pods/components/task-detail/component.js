import Ember from 'ember';

const {
  inject
} = Ember;

export default Ember.Component.extend({
  store: inject.service(),
  task: null,
  newSubTaskTitle: '',

  actions: {
    addSubTask() {
      let title = this.get('newSubTaskTitle');

      if (!title) {
        return;
      }

      let sOrder = Math.max(...this.get('task.subTasks').mapBy('sOrder')) || 0;

      let newSubTask = this.get('store').createRecord('task', {
        parentTask: this.get('task'),
        title: title,
        sOrder: ++ sOrder,
        isDone: false
      });

      newSubTask.save().then(() => this.get('task').save());
      this.set('newSubTaskTitle', '');
    },

    save() {
      this.get('task').save();
    },

    toggleDone(task, done) {
      task.set('done', done);
      task.save();
    }
  }
});
