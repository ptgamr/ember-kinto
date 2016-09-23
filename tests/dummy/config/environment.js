/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    podModulePrefix: 'dummy/pods',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['ember-simple-auth'] = {
    authenticationRoute: 'login',
    routeAfterAuthentication: 'lists'
  };

  ENV['torii'] = {
    sessionServiceName: 'session',
    providers: {
      'github-oauth2': {
        apiKey: 'bc6a0e70dc379a6313ae',
        scope: 'user',
        redirectUri: 'http://localhost:4200/lists'
      }
    }
  };


  ENV.serviceWorker = {
    enabled: false,
    debug: true,
    includeRegistration: false,
    fallback: [
      "/(.*) /index.html",
    ],
    precacheURLs: [
      "/index.html",
    ],
    fastestURLs: [
      { route: "/(.*)", method: "get", options: { origin: "https://fonts.gstatic.com" } },
      { route: "/css", method: "get", options: { origin: "https://fonts.googleapis.com" } },
    ],
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.serviceWorker.includeRegistration = true;
    ENV.serviceWorker.enabled = true;
  }

  return ENV;
};
