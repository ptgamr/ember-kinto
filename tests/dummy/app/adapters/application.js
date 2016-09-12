import { KintoAdapter } from 'ember-kinto';
import Kinto from 'npm:kinto';

const db = new Kinto({
  remote: 'https://ember-kinto-api.herokuapp.com/v1/',
  bucket: 'ptgamr',
  dbPrefix: 'ptgamr', // TODO: should be the authorized user
  headers: {
    Authorization: 'Basic ' + btoa('ptgamr:ptgamr')
  }
});

export default KintoAdapter.extend({
  db
});
