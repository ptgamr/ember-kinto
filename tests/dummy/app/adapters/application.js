import { KintoAdapter } from 'ember-kinto';
import Kinto from 'npm:kinto';

const db = new Kinto({
  remote: 'http://192.241.238.230:8000/v1/',
  bucket: 'app',
  headers: {
    Authorization: 'Basic ' + btoa('anh:anh')
    //Authorization: ''
  }
});

export default KintoAdapter.extend({
  db
});
