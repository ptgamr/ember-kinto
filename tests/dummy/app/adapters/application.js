import Ember from 'ember';
import { KintoAdapter } from 'ember-kinto';
import Kinto from 'npm:kinto';

const db = new Kinto({
  // remote: 'http://192.241.238.230:8000/v1/',
  remote: 'http://localhost:8888/v1/',
  bucket: 'app'
});

const {
  computed,
  inject
} = Ember;

export default KintoAdapter.extend({
  db,
  session: inject.service(),
  authorizationHeader: computed('session.data.authenticated.authorizationCode', {
    get() {
      return `github+bearer ${this.get('session.data.authenticated.accessToken')}`;
    }
  })
});
