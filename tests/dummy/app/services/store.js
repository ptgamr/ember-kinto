import Ember from 'ember';
import { KintoStore } from 'ember-kinto';
import Pusher from 'npm:pusher-js';

const {
  inject,
  observer,
  on
} = Ember;

export default KintoStore.extend({

  syncCollections: ['list', 'task'],
  pusherKey: '8dad656e802777288224',
  session: inject.service(),

  onSessionAuthenticated: on('init', observer('session.data.authenticated.userId', function() {
    if (this.get('session.data.authenticated.userId')) {
      this.subscribeToCollections();
    }
  })),

  init() {
    this._super(...arguments);

    this.pusher = new Pusher(this.get('pusherKey'), {
      encrypted: true,
      enabledTransports: ['ws']
    });
  },

  subscribeToCollections() {
    this.get('syncCollections').forEach(collectionName => this.subscribeToCollection(collectionName));
  },

  subscribeToCollection(collectionName) {
    let userId = this.get('session.data.authenticated.userId');
    let channelName = `${userId}-${collectionName}s-record`;
    channelName = channelName.replace(/[^a-zA-Z0-9_\\-]/, '');

    let channel = this.pusher.subscribe(channelName);
    channel.bind_all((evtName, data) => {
      if (evtName === 'pusher:subscription_succeeded') {
        return;
      }
      this.applyChanges(collectionName, evtName, data);
    });
  }
});
