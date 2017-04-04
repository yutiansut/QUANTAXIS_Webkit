var should = require('should');
var superagent = require('superagent');

describe('superagent-use', function() {
  var agent;

  var prefix = 'http://example.com';
  var prefixMiddleware = function(req) {
    if(req.url[0] === '/') {
      req.url = prefix + req.url;
    }
    return req;
  };

  beforeEach(function() {
    agent = require('..')(superagent);
  });

  it('should apply plugin to all requests', function() {
    agent
      .use(prefixMiddleware);

    var req1 = agent.get('/');
    req1.request()._headers.host.should.equal('example.com');

    var req2 = agent.patch('/update');
    req2.request()._headers.host.should.equal('example.com');
  });

  it('should be chainable', function() {
    var req = agent
      .use(prefixMiddleware)
      .get('/');

    req.request()._headers.host.should.equal('example.com');
  });

  it('should return a new instance of superagent', function() {
     var withPrefix = require('..')(superagent);
         withoutPrefix = require('..')(superagent);

     withPrefix.use(prefixMiddleware);

     withPrefix.get('/').request()._headers.host.should.equal('example.com');
     withoutPrefix.get('/').request()._headers.host.should.not.equal('example.com');
   });
});
