import Ember from 'ember';
import Pusher from 'npm:pusher-js';

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

  init() {
    this._super(...arguments);

    // Pusher credentials
    // TODO: move these setup to a proper place ?
    var pusherKey = '8dad656e802777288224';

    var pusher = new Pusher(pusherKey, {
      encrypted: true
    });

    var channelName = 'ptgamr-tasks-record';

    var channel = pusher.subscribe(channelName);

    channel.bind_all((evtName, data) => {
      if (evtName === 'pusher:subscription_succeeded') {
        return;
      }
      this.get('store').applyChanges('task', evtName, data);
    });
  },

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
