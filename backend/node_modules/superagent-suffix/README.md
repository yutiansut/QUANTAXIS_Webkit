#Superagent Suffix Middleware
Middleware to add a suffix to superagent request url

##Installation
```
npm install --save superagent-suffix
```

##Example
```Javascript
var request = require('superagent');
// For example purposes
var prefix = require('superagent-prefix');
var suffix = require('superagent-suffix');
request
  .get('/products')
  .use(prefix('https://www.example.com/'))
  .use(suffix('.json'))
  .end(function(err, res) {
    // Result from https://www.example.com/products.json
    console.log(res);
  });
```
