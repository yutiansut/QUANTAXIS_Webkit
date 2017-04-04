'use strict'
/**
 * ## tests
 *
 * I've never written any tests before, so I'm sure there's room for
 * criticism here.
 *
 */

const request       = require('superagent')
const _             = require('lodash')
const assert        = require('chai').assert
const Throttle      = require('../index')
const http          = require('http')
require('mocha-jshint')({
  paths: [
    'index.js'
  ]
})

let log
let max
let mockServer
let respond

/**
 * ## mockServer
 *
 * a very fancy no-dep http server that just returns 'ok' to every request,
 * it seems to take about 3ms to do the response on my clunky dev machine
 */
mockServer = (delay, jitter) => {
  return http.createServer(
    (request, response) => {
      if (!delay) return respond(response)
      if (!jitter) jitter = 0
      setTimeout(
        () => respond(response),
        Math.floor((Math.random() * jitter) + delay)
      )
    }
  ).listen(3003)
}

respond = (response) => {
  response.writeHead(200)
  response.end()
}

/**
 * ## log
 *
 * a helper to write pretty tables when attached to Throttle events
 */
log = function(prefix) {
  let count = 0
  let start = Date.now()
  return (request) => {
    let rate
    let check = new Date(Date.now() - request.throttle.ratePer)
    rate = request.throttle._requestTimes.length - 1 - _.findLastIndex(
      request.throttle._requestTimes,
      (date) => (date < check)
    )
    count += 1
    console.log([
      '| ',
      _.padEnd(prefix, 10, ' '),
      '| ',
      _.padStart(count, 3, ' '),
      ' | ',
      _.padStart(Date.now() - start, 6, ' '),
      ' | conc: ',
      _.padStart(request.throttle._current, 3, ' '),
      ' | rate: ',
      _.padStart(rate, 3, ' '),
      ' | queued: ',
      _.padStart(request.throttle._buffer.length, 3, ' '),
      ' | ',
      request.serial
    ].join(''))
  }
}

/**
 * ## max
 *
 * collates various maximums, useful for tests
 */
max = function() {
  let count = 0
  let maxRate = 0
  let maxConcurrent = 0
  let maxBuffer = 0
  let start = Date.now()
  return (request) => {
    if (request) {
      let rate
      let check = new Date(Date.now() - request.throttle.ratePer)
      rate = request.throttle._requestTimes.length - 1 - _.findLastIndex(
        request.throttle._requestTimes,
        (date) => (date < check)
      )
      count += 1
      if (maxConcurrent < request.throttle._current)
        maxConcurrent = request.throttle._current
      if (maxRate < rate)
        maxRate = rate
      if (maxBuffer < request.throttle._buffer.length)
        maxBuffer = request.throttle._buffer.length
    }
    return {
      count,
      maxRate,
      maxConcurrent,
      maxBuffer
    }
  }
}

describe('throttle', () => {

  it ('should clear errored requests (issue #6)', (done) => {
    let throttle = new Throttle({
      rate: 10000, // how many requests can be sent every `ratePer`
      ratePer: 10000, // number of ms in which `rate` requests may be sent
      concurrent: 2 // how many requests can be sent concurrently
    })

    // .on('sent', log('sent'))
    // .on('received', log('received'))

    // this request will throw error because server is inactive
    request.get('http://localhost:3003').use(throttle.plugin()).end(() => {
      assert(throttle._current == 0, 'request has not been cleared')
      done()
    })



  })

  it('should work with low concurrency', (done) => {
    let server = mockServer()
    let highest = max()
    let throttle = new Throttle({
      active: true,
      rate: 1000,
      ratePer: 2000,
      concurrent: 2
    })
    throttle.on('sent', highest)
    throttle.on('received', highest)
    // throttle.on('sent', log('sent'))
    // throttle.on('received', log('rcvd'))


    _.times(100, function(idx) {
      request
      .get('http://localhost:3003')
      .use(throttle.plugin())
      .end()
    })

    throttle.on('drained', () => {
      let result = highest()
      server.close()
      assert(result.maxConcurrent == 2, 'highest concurrency was 2')
      done()
    })
  })

  it('should work with low rate', (done) => {
    let server = mockServer()
    let highest = max()
    let throttle = new Throttle({
      active: true,
      rate: 2,
      ratePer: 1000,
      concurrent: 2
    })
    throttle.on('sent', highest)
    throttle.on('received', highest)
    // throttle.on('sent', log('sent'))
    // throttle.on('received', log('rcvd'))


    _.times(10, function(idx) {
      request
      .get('http://localhost:3003')
      .use(throttle.plugin())
      .end()
    })

    throttle.on('drained', () => {
      let result = highest()
      server.close()
      assert(result.maxRate == 2, 'highest rate was 2')
      done()
    })
  })

  it('should work when resource bound (issue #6)', (done) => {
    let server = mockServer()
    let highest = max()
    let throttle = new Throttle({
      active: true,
      rate: 1000,
      ratePer: 5000,
      concurrent: 1000
    })
    throttle.on('sent', highest)
    throttle.on('received', highest)
    // throttle.on('sent', log('sent'))
    // throttle.on('received', log('rcvd'))


    _.times(1000, function(idx) {
      request
      .get('http://localhost:3003')
      .use(throttle.plugin())
      .end()
    })

    throttle.on('drained', () => {
      let result = highest()
      server.close()
      assert.isOk(true, 'has thrown error?')
      done()
    })
  })

  /**
   * ## it should allow serialised queues
   *
   * this test is pretty ugly, but I can't think of a better way for the time
   * being. Basically there's an array of serial identifiers, which are attached
   * to requests, then as they come back those identifiers are stored, and teh
   * test is passed if no serialised requests come back consecutively.
   *
   * a better test would ensure that no two serial requests for the same uri
   * are requested simultaneously. But for now this will do.
   *
   */
  it('should allow serialised queues', (done) => {
    let server = mockServer(1000)
    let throttle = new Throttle({
      active: true,
      rate: 10,
      ratePer: 5000,
      concurrent: 2
    })
    // throttle.on('sent', log('sent'))
    // throttle.on('received', log('rcvd'))


    let uris = [
      undefined,
      'someUri',
      'someUri',
      'someUri',
      undefined,
      undefined,
      undefined,
      undefined
    ]
    let responses = []

    _.each(uris, (uri) => {
      request.get('http://localhost:3003')
      .use(throttle.plugin(uri))
      .end((err, res) => responses.push(request.serial))
    })

    throttle.on('drained', () => {
      // responses should not have two consecutive 'someUri'
      let consecutive = _.some(responses, (response, idx) => {
        if (idx == 0) return
        if (
          (responses[idx - 1] == 'someUri') &&
          (responses[idx] == 'someUri')
        ) return true
      })
      server.close()
      assert.isOk(!consecutive, 'requests have not been serialised')
      done()
    })
  })

  it ('should not break end handler (issue #5)', (done) => {
    let server = mockServer()
    let throttle = new Throttle()

    request
    .get('http://localhost:3003')
    .use(throttle.plugin())
    .end(() => {
      assert.isOk(true, 'end handler not working?')
      server.close()
      done()
    })
  })

  it ('should return superagent instance (issue #2)', () => {
    let server = mockServer()
    let throttle = new Throttle()

    let instance = request.get('http://localhost:3003')
    let returned = instance.use(throttle.plugin())
    assert(instance === returned, 'instance not returned')
    server.close()
  })


})



