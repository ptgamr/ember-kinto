import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  trustedHosts: [
    /\.example\./,
    'localhost',
  ]
});

