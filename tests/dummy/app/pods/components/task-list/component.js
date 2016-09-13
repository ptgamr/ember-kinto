import Ember from 'ember';

const {
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  store: inject.service(),
  taskTitle: '',
  list: null,
  tasks: [],
  taskSorting: ['sOrder:desc'],

  sortedTasks: computed.sort('tasks', 'taskSorting'),

  onItemCreate: Ember.K,
  onItemUpdate: Ember.K,
  onItemDelete: Ember.K,

  actions: {
    createTask() {
      let taskTitle = this.get('taskTitle');

      if(!taskTitle) {
        console.log(' >>> please enter something');
        return;
      }

      let sOrder = Math.max(...this.get('tasks').mapBy('sOrder')) || 0;

      let newTask = {
        title: taskTitle,
        done: false,
        list: this.get('list'),
        sOrder: ++ sOrder
      };

      this.onItemCreate(newTask);

      this.set('taskTitle', '');
    },

    deleteTask(task) {
      this.onItemDelete(task);
    },

    updateTask(task) {
      this.onItemUpdate(task);
    }
  }
});
