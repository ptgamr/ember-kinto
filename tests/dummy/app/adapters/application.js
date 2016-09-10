import KintoAdapter from 'ember-kinto';
import Kinto from 'npm:kinto';

const db = new Kinto({
  remote: 'http://localhost:8888/v1/',
  bucket: 'ember-kinto',
  dbPrefix: 'ptgamr', // TODO: should be the authorized user
  headers: {
    Authorization: 'Basic ' + btoa('anh:anh')
  }
});

export default KintoAdapter.extend({
  db
});
