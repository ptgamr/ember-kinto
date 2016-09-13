import Ember from 'ember';

export default Ember.Component.extend({
  item: null,
  onItemUpdate: Ember.K,
  onItemDelete: Ember.K,

  actions: {
    startEdit() {
      this.set('isEditing', true);
    },

    finishEdit() {
      this.set('isEditing', false);
      this.onItemUpdate(this.get('item'));
    }
  }
});

