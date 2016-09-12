# Ember-kinto

The offline first Ember Data adapter - backed by Mozilla's Kinto offline first API

Demo: https://ember-kinto-demo.herokuapp.com/

## Concepts

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


This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-kinto`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
