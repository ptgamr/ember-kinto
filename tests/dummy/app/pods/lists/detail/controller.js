import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Controller.extend({

  allTasks: computed({
    get() {
      return this.store.peekAll('task');
    }
  }),

  tasks: computed('model.id', 'allTasks.[]', {
    get() {
      let listId = this.get('model.id');
      return this.get('allTasks').filterBy('list.id', listId);
    }
  }),

  actions: {
    create(newTask) {
      let task = this.get('store').createRecord('task', newTask);
      return task.save();
    },

    update(item) {
      return item.save();
    },

    del(item) {
      return item.destroyRecord();
    }
  }
});
