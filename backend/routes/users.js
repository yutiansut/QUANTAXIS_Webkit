var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signin', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/findsame', function(req, res, next) {
  res.send('respond with a resource');
});
module.exports = router;
