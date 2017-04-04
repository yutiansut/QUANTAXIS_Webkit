var methods = require('methods');
var extend = require('extend');

module.exports = function(_superagent) {
  var superagent = extend({}, _superagent);

  var uses = [];

  superagent.use = function(fn) {
    uses.push(fn);
    return this;
  };

  if(methods.indexOf('del') === -1) {
    methods = methods.slice(0);
    methods.push('del');
  }
  methods.forEach(function(method) {
    superagent[method] = function() {
      var request = _superagent[method].apply(superagent, arguments);
      uses.forEach(function(use) {
        request = request.use(use);
      })
      return request;
    };
  });

  return superagent;
};
