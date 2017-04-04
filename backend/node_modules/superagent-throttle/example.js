'use strict'
const request       = require('superagent')
const _             = require('lodash')
const Throttle      = require('./index')

// create throttle instance
let throttle = new Throttle({
  // start unpaused
  active: true,
  // send max 5 requests every `ratePer` ms
  rate: 5,
  // send max `rate` requests every 10000 ms
  ratePer: 4000,
  // max 2 requests should run concurrently
  concurrent: 4
})

_.times(10, function(idx) {
  request
  .get('placekitten.com/100/' + (100 + idx))
  .use(throttle.plugin('foo'))
  .end(function(err, res) {
    console.log(err ? err : 'serial ' + idx)
  })
  console.log('added ' + idx)
})
_.times(10, function(idx) {
  request
  .get('placekitten.com/100/' + (100 + idx))
  .use(throttle.plugin())
  .end(function(err, res) {
    console.log(err ? err : 'res ' + idx)
  })
  console.log('added ' + idx)
})


