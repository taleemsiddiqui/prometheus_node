var express = require('express');
var router = express.Router();
const Prometheus = require('prom-client')

router.get('/', function (req, res, next) {
    res.end(Prometheus.register.metrics())
});

module.exports = router;
