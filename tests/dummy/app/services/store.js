import { KintoStore } from 'ember-kinto';
import Pusher from 'npm:pusher-js';

export default KintoStore.extend({

  syncCollections: ['tasks'],
  pusherKey: '8dad656e802777288224',

  init() {
    this._super(...arguments);

    this.pusher = new Pusher(this.get('pusherKey'), {
      encrypted: true
    });

    this.get('syncCollections').forEach(collectionName => this.subscribeToCollection(collectionName));
  },

  subscribeToCollection(collectionName) {
    // this should match your kinto-server config
    // TODO: find out the correct way to get bucket name here
    let channelName = `ptgamr-${collectionName}-record`;

    let channel = this.pusher.subscribe(channelName);
    channel.bind_all((evtName, data) => {
      if (evtName === 'pusher:subscription_succeeded') {
        return;
      }
      this.applyChanges('task', evtName, data);
    });
  }
});
