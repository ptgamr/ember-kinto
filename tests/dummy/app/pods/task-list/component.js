import Ember from 'ember';

const {
  inject
} = Ember;

export default Ember.Component.extend({
  store: inject.service(),
  taskTitle: '',
  tasks: [],

  init() {
    this._super(...arguments);
  },

  actions: {
    createTask() {
      let taskTitle = this.get('taskTitle');

      if(!taskTitle) {
        console.log('please enter something');
        return;
      }

      let newTask = this.get('store').createRecord('task', {
        title: taskTitle,
        done: false
      });

      newTask.save().then();

      this.set('taskTitle', '');
    },

    deleteTask(task) {
      task.destroyRecord();
    },

    sync() {
      this.get('store').sync('task');
    }
  }
});
