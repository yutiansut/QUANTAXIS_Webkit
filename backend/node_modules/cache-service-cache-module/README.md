# cache-service-cache-module

* A light-weight cache plugin for [superagent-cache](https://github.com/jpodwys/superagent-cache) and [cache-service](https://github.com/jpodwys/cache-service)
* AND a standalone in-memory cache that's optionally backed by `localStorage` and `sessionStorage`

#### Features

* Optionally backed by localStorage and sessionStorage
* Background refresh
* No external dependencies
* Robust API
* Built-in logging with a `verbose` flag.
* Compatible with `cache-service` and `superagent-cache`
* Excellent `.mset()` implementation which allows you to set expirations on a per key, per function call, and/or per `cache-service-cache-module` instance basis.

# Basic Usage

Require and instantiate
```javascript
var cModule = require('cache-service-cache-module');

var cacheModuleConfig = {storage: 'session', defaultExpiration: 60};
var cacheModule = new cModule(cacheModuleConfig);
```

Cache!
```javascript
cacheModule.set('key', 'value');
```

# Cache Module Configuration Options

`cache-service-cache-module`'s constructor takes an optional config object with any number of the following properties:

## type

An arbitrary identifier you can assign so you know which cache is responsible for logs and errors.

* type: string
* default: 'cache-module'

## storage

Indicates whether cacheModule's in-memory cache should be backed by `localStorage` or `sessionStorage`. The available options are 'local' and 'session'. If not set, or if running in node, it will default to an in-memory cache. When a browser storage is activated, cacheModule will still write to and read from an in-memory cache in the interest of speed, but at initialization it will load it's in-memory cache from browser storage and write all changes back to browser storage.

* type: string
* default: ''

## defaultExpiration

The expiration to include when executing cache set commands. Can be overridden via `.set()`'s optional `expiraiton` param.

* type: int
* default: 900
* measure: seconds

## backgroundRefreshInterval

How frequently should all background refresh-enabled keys be scanned to determine whether they should be refreshed. For a more thorough explanation on `background refresh`, see the [Using Background Refresh](#using-background-refresh) section.

* type: int
* default: 60000
* measure: milliseconds

## backgroundRefreshMinTtl

The maximum ttl a scanned background refresh-enabled key can have without triggering a refresh. This number should always be greater than `backgroundRefreshInterval`.

* type: int
* default: 70000
* measure: milliseconds

## backgroundRefreshIntervalCheck

Whether to throw an exception if `backgroundRefreshInterval` is greater than `backgroundRefreshMinTtl`. Setting this property to false is highly discouraged.

* type: boolean
* default: true

## verbose

> When used with `cache-service`, this property is overridden by `cache-service`'s `verbose` value.

When false, `cache-service-cache-module` will log only errors. When true, `cache-service-cache-module` will log all activity (useful for testing and debugging).

* type: boolean
* default: false

# API

As a `cache-service`-compatible cache, `cache-service-cache-module` matches [`cache-service`'s API](https://github.com/jpodwys/cache-service#api).

## .get(key, callback (err, response))

Retrieve a value by a given key.

* key: type: string
* callback: type: function
* err: type: object
* response: type: string or object

## .mget(keys, callback (err, response))

Retrieve the values belonging to a series of keys. If a key is not found, it will not be in `response`.

* keys: type: an array of strings
* callback: type: function
* err: type: object
* response: type: object, example: {key: 'value', key2: 'value2'...}

## .set(key, value, [expiraiton], [refresh(key, cb)], [callback])

> See the [Using Background Refresh](#using-background-refresh) section for more about the `refresh` and `callback` params.

Set a value by a given key.

* key: type: string
* value: type: string || objects
* expiration: type: int, measure: seconds
* refresh: type: function
* callback: type: function

## .mset(obj [, expiration, callback])

Set multiple values to multiple keys

* obj: type: object, example: {'key': 'value', 'key2': 'value2', 'key3': {cacheValue: 'value3', expiration: 60}}
* callback: type: function

This function exposes a heirarchy of expiration values as follows:
* The `expiration` property of a key that also contains a `cacheValue` property will override all other expirations. (This means that, if you are caching an object, the string 'cacheValue' is a reserved property name within that object.)
* If an object with both `cacheValue` and `expiration` as properties is not present, the `expiration` provided to the `.mset()` argument list will be used.
* If neither of the above is provided, each cache's `defaultExpiration` will be applied.

## .del(keys, [callback (err, count)])

Delete a key or an array of keys and their associated values.

* keys: type: string || array of strings
* callback: type: function
* err: type: object
* count: type: int

## .flush([cb])

Flush all keys and values.

* callback: type: function

# Using Background Refresh

With a typical cache setup, you're left to find the perfect compromise between having a long expiration so that users don't have to suffer through the worst case load time, and a short expiration so data doesn't get stale. `cache-service-cache-module` eliminates the need to worry about users suffering through the longest wait time by automatically refreshing keys for you. Here's how it works:

#### How do I turn it on?

By default, background refresh is off. It will turn itself on the first time you pass a `refresh` param to `.set()`.

#### Configure

There are three options you can manipulate. See the API section for more information about them.

* `backgroundRefreshInterval`
* `backgroundRefreshMinTtl`
* `backgroundRefreshIntervalCheck`

#### Use

Background refresh is exposed via the `.set()` command as follows:

```javascript
cacheModule.set('key', 'value', 300, refresh, cb);
```

If you want to pass `refresh`, you must also pass `cb` because if only four params are passed, `cache-service-cache-module` will assume the fourth param is `cb`.

#### The Refresh Param

###### refresh(key, cb(err, response))

* key: type: string: this is the key that is being refreshed
* cb: type: function: you must trigger this function to pass the data that should replace the current key's value

The `refresh` param MUST be a function that accepts `key` and a callback function that accepts `err` and `response` as follows:

```javascript
var refresh = function(key, cb){
  var response = goGetData();
  cb(null, response);
}
```
