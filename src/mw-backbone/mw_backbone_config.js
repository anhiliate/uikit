var _backboneAjax = Backbone.ajax,
  _backboneSync = Backbone.sync,
  _$http,
  _$q;

angular.module('mwUI.Backbone')

  .run(function ($http, $q) {
    _$http = $http;
    _$q = $q;
  });

Backbone.ajax = function (options) {
  if (mwUI.Backbone.use$http && _$http) {
    // Set HTTP Verb as 'method'
    options.method = options.type;
    // Use angulars $http implementation for requests
    return _$http.apply(angular, arguments).then(function(resp){
      if (options.success && typeof options.success === 'function') {
        options.success(resp);
      }
      return resp;
    }, function(resp){
      if (options.error && typeof options.error === 'function') {
        options.error(resp);
      }
      return _$q.reject(resp);
    });
  } else {
    return _backboneAjax.apply(this, arguments);
  }
};

Backbone.sync = function (method, model, options) {
  // we have to set the flag to wait true otherwise all cases were you want to delete mutliple entries will break
  // https://github.com/jashkenas/backbone/issues/3534
  // This flag means that the server has to confirm the creation/deletion before the model will be added/removed to the
  // collection
  options = options || {};
  if (_.isUndefined(options.wait)) {
    options.wait = true;
  }
  // Instead of the response object we are returning the backbone model in the promise
  return _backboneSync.call(Backbone, method, model, options).then(function () {
    return model;
  });
};