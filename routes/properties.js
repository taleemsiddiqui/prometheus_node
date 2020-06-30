var express = require('express');
var router = express.Router();
const Prometheus = require('prom-client')

const PrometheusMetrics = {
  requestCounter: new Prometheus.Counter({
    name: 'throughput_properties',
    help: 'The number of properties requests served',
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  PrometheusMetrics.requestCounter.inc()
  res.send('respond with a resource');
});

module.exports = router;
