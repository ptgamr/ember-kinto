import Ember from 'ember';

const {
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  store: inject.service(),
  taskTitle: '',
  tasks: [],
  taskSorting: ['sOrder:desc'],

  sortedTasks: computed.sort('tasks', 'taskSorting'),

  actions: {
    createTask() {
      let taskTitle = this.get('taskTitle');

      if(!taskTitle) {
        console.log(' >>> please enter something');
        return;
      }

      let taskOrder = Math.max(...this.get('tasks').mapBy('sOrder')) || 0;

      let newTask = this.get('store').createRecord('task', {
        title: taskTitle,
        done: false,
        sOrder: ++ taskOrder
      });

      newTask.save().then();

      this.set('taskTitle', '');
    },

    deleteTask(task) {
      task.destroyRecord();
    },

    updateTask(task) {
      task.save();
    }
  }
});
