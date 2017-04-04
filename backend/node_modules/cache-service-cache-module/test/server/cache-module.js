var expect = require('expect');
var mockStorage = require('mock-localstorage');
var storageMock = new mockStorage();
var cModule = require('../../cacheModule');
var cacheModule = new cModule({
  backgroundRefreshInterval: 500,
  storageMock: storageMock
});

var key = 'key';
var value = 'value';
var mockName = 'cache-module-storage-mock';

beforeEach(function(){
  cacheModule.flush();
});

describe('cacheModule Tests', function () {
  it('Getting absent key should return null', function (done) {
    cacheModule.get(key, function (err, result){
      expect(result).toBe(null);
      done();
    });
  });
  it('Setting then getting key should return value', function (done) {
    cacheModule.set(key, value);
    cacheModule.get(key, function (err, result) {
      expect(result).toBe(value);
      var data = storageMock.getItem(mockName);
      expect(data.indexOf('key')).toBeGreaterThan(-1);
      done();
    });
  });
  it('Setting then deleting then getting key should return null', function (done) {
    cacheModule.set(key, value);
    cacheModule.del(key);
    cacheModule.get(key, function (err, result) {
      expect(result).toBe(null);
      var data = storageMock.getItem(mockName);
      expect(data.indexOf('key')).toBe(-1);
      done();
    });
  });
  it('Setting several keys then calling .flushAll() should remove all keys', function (done) {
    cacheModule.set(key, value);
    cacheModule.set('key2', 'value2');
    cacheModule.set('key3', 'value3');
    cacheModule.flush();
    cacheModule.get(key, function (err, response){
      expect(response).toBe(null);
      cacheModule.get(key, function (err, response){
        expect(response).toBe(null);
        cacheModule.get(key, function (err, response){
          expect(response).toBe(null);
          var data = storageMock.getItem(mockName);
          expect(data.indexOf(key)).toBe(-1);
          expect(data.indexOf('key2')).toBe(-1);
          expect(data.indexOf('key3')).toBe(-1);
          done();
        });
      });
    });
  });
  it('Setting several keys then calling .mget() should retrieve all keys', function (done) {
    cacheModule.set(key, value);
    cacheModule.set('key2', 'value2');
    cacheModule.set('key3', 'value3');
    cacheModule.mget([key, 'key2', 'key3', 'key4'], function (err, response){
      expect(response.key).toBe('value');
      expect(response.key2).toBe('value2');
      expect(response.key3).toBe('value3');
      expect(response.key4).toBe(undefined);
      done();
    });
  });
  it('Setting several keys via .mset() then calling .mget() should retrieve all keys', function (done) {
    cacheModule.mset({key: value, 'key2': 'value2', 'key3': 'value3'});
    cacheModule.mget([key, 'key2', 'key3', 'key4'], function (err, response){
      expect(response.key).toBe('value');
      expect(response.key2).toBe('value2');
      expect(response.key3).toBe('value3');
      expect(response.key4).toBe(undefined);
      var data = storageMock.getItem(mockName);
      expect(data.indexOf(key)).toBeGreaterThan(-1);
      expect(data.indexOf('key2')).toBeGreaterThan(-1);
      expect(data.indexOf('key3')).toBeGreaterThan(-1);
      expect(data.indexOf('key4')).toBe(-1);
      done();
    });
  });
  it('Using background refresh should reset a nearly expired key', function (done) {
    var refresh = function(key, cb){
      cb(null, 1);
    }
    cacheModule.set(key, value, 1, refresh, function (err, result){ 
      setTimeout(function(){
        cacheModule.get(key, function (err, response){
          expect(response).toBe(1);
          done();
        });
      }, 1500);
    });
  });
  it('Using background refresh should work for multiple keys', function (done) {
    function noop() {}
    this.timeout(5000);
    var refresh = function(key, cb){
      switch(key) {
        case 'one':
          setTimeout(function() {
            cb(null, 1);
          }, 100);
          break;
        case 'two':
          setTimeout(function() {
            cb(null, 2);
          }, 100);
          break;
      }
    };

    cacheModule.set('one', value, 1, refresh, noop);
    cacheModule.set('two', value, 1, refresh, noop);

    setTimeout(function() {
      var results = [];
      function examineResults() {
        results.forEach(function(result) {
          if (result.key === 'one') {
            expect(result.response).toBe(1);
          } else {
            expect(result.response).toBe(2);
          }
        });

        done();
      }
      cacheModule.get('one', function (err, response){
        results.push({key: 'one', response: response});
        if (results.length === 2) {
          examineResults();
        }
      });
      cacheModule.get('two', function (err, response){
        results.push({key: 'two', response: response});
        if (results.length === 2) {
          examineResults();
        }
      });

    }, 1500);
  });

});
