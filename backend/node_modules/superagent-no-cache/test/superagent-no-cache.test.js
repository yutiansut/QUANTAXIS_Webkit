var expect = require('chai').expect

var MockBrowser = require('mock-browser').mocks.MockBrowser
var mock = new MockBrowser()

document = mock.getDocument()

var nocache = require('../index')

/* Definitions for JS Standard */
/* global describe, it */

describe('superagent-no-cache', _suiteMain)

/* Suites */

function _suiteMain () {
  it('should return a function', _specFunctionCheck)
  it('should require the "set" subfunction', _specSetCheck)
  it('should run the "set" subfunction, assigning the appropriate values', _specSetRun)
  it('should add an additional query for IE browsers', _specIE)
  it('should add an additional param to an existing query string for IE browsers', _specIEExistingQuery)
}

/* Specs */

function _specFunctionCheck (done) {
  expect(nocache).to.be.a('function')
  done()
}

function _specSetCheck (done) {
  var request = {};
  try{
    var results = nocache(request)
    expect(true)
      .to.be(false)
    done('This should have been an error')
  }
  catch(error){
    expect(error)
      .to.be.an('object')
    expect(error.toString())
      .to.contain('TypeError')
    done()
  }
}
function _specSetRun (done) {
  var request = {
    set:_mockSet,
    data:{}
  };
  var results = nocache(request)

  expect(results.data['X-Requested-With'])
    .to.be.a('string')
  expect(results.data['X-Requested-With'])
    .to.equal('XMLHttpRequest')

  expect(results.data['Cache-Control'])
    .to.be.a('string')
  expect(results.data['Cache-Control'])
    .to.equal('no-cache,no-store,must-revalidate,max-age=-1,private')

  expect(results._query)
    .to.be.an('undefined')

  done()
}
function _specIE (done) {
  var request = {
    set:_mockSet,
    data:{}
  };
  var results = nocache(request, true)
  expect(results.data['X-Requested-With'])
    .to.equal('XMLHttpRequest')
  expect(results.data['Cache-Control'])
    .to.equal('no-cache,no-store,must-revalidate,max-age=-1,private')
  expect(results._query)
    .to.be.an('array')
  expect(results._query[0])
    .to.be.a('string')
  expect(results._query[0].substring(0, results._query[0].length - 1))
    .to.equal(Date.now().toString().substring(0, results._query[0].length - 1))
  done()
}
function _specIEExistingQuery (done) {
  var request = {
    set:_mockSet,
    _query: ['param=123'], // random query string
    data:{}
  };
  var results = nocache(request, true);
  expect(results.data['X-Requested-With'])
      .to.equal('XMLHttpRequest')
  expect(results.data['Cache-Control'])
      .to.equal('no-cache,no-store,must-revalidate,max-age=-1,private')
  expect(results._query)
      .to.be.an('array')
  expect(results._query[0])
      .to.be.a('string')
  expect(results._query[0])
      .to.match(/^param=123&[0-9].*$/)
  done();
}

/* Mocks */

function _mockSet (arg1, arg2) {
  this.data[arg1] = arg2
}
