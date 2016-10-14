import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

const { inject: { service } } = Ember;

export default ToriiAuthenticator.extend({
  torii: service(),
  ajax: service(),

  authenticate() {
    const ajax = this.get('ajax');
    return this._super(...arguments).then(data => {
      return ajax.request('http://localhost:8888/v1/github/token', {
        type: 'POST',
        dataType: 'json',
        data: {
          authorization_code: data.authorizationCode
        }
      }).then(({access_token}) => {
        return ajax.request('http://localhost:8888/v1/buckets/default', {
          type: 'GET',
          headers: {
            authorization: 'github+bearer ' + access_token
          }
        }).then(({permissions}) => {
          return {
            userId: permissions.write[0],
            accessToken: access_token,
            provider: data.provider
          };
        });
      });
    });
  }

});
