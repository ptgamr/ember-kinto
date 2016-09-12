# Ember-kinto

The offline first Ember Data adapter - backed by Mozilla's Kinto offline first API

Demo: https://ember-kinto-demo.herokuapp.com/

Note: THIS IS STILL A **WORK IN-PROGRESS**

## Concepts

![](http://i.imgur.com/MlsHBU5.png)

## Preparation

### Each user in a single bucket (this is usually happen after user Sign Up)

Create the bucket (ptgamr):
```
echo '{"data": {"id": "ptgamr"}}' | http POST https://ember-kinto-api.herokuapp.com/v1/buckets --auth="ptgamr:ptgamr" --verbose
```

Create a collection (task) inside that bucket:
```
echo '{"data": {"id": "tasks"}}' | http POST https://ember-kinto-api.herokuapp.com/v1/buckets/ptgamr --auth="ptgamr:ptgamr" --verbose
```

## Usages

Include the add-on to your application and do the following setup:


```javascript
// app/adapters/application.js
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


// app/serializers/application.js
import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  keyForAttribute(attr) {
    return Ember.String.underscore(attr);
  }
});


// app/services/store.js
import { KintoStore } from 'ember-kinto';

export default KintoStore;

```

### store.sync(modelName)

Will trigger Kinto `collection.sync()`, the result of the sync will then be updated back to Ember Data store.

[More detail on how Kinto.sync() works](https://kintojs.readthedocs.io/en/latest/api/#fetching-and-publishing-changes)

### store.applyChanges(modelName, action, data)

Should be use when receiving update from Websocket (Pusher or your own websocket), the changes will be apply to IndexDB first, then propagate back to Ember Data store


## Contribute

### Installation

* `git clone <repository-url>` this repository
* `cd ember-kinto`
* `npm install`
* `bower install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
