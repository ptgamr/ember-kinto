import Ember from 'ember';

const {
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  store: inject.service(),

  items: [],
  itemSorting: ['sOrder:desc'],
  sortedItems: computed.sort('items', 'itemSorting'),

  listName: '',

  actions: {

    create() {
      let listName = this.get('listName');

      if(!listName) {
        console.log(' >>> please enter something');
        return;
      }

      let sOrder = Math.max(...this.get('items').mapBy('sOrder')) || 0;

      let newItem = this.get('store').createRecord('list', {
        name: listName,
        sOrder: ++ sOrder
      });

      newItem.save();

      this.set('listName', '');
    },

    update(item) {
      return item.save();
    },

    del(item) {
      this.get('store').peekAll('task').filterBy('list.id', item.get('id')).invoke('destroyRecord');
      item.destroyRecord();
    }
  }
});


