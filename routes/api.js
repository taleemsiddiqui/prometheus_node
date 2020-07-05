var express = require('express');
var router = express.Router();

const Prometheus = require('prom-client')

const Express_Request_Latency = new Prometheus.Histogram({
    name: 'express_request_latency_seconds',
    help: 'Express Request Latency',
    labelNames: ['method', 'endpoint']
});

const Express_Request_Count = new Prometheus.Counter({
    name: 'express_request_count',
    help: 'Express Request Count',
    labelNames: ['method', 'endpoint', 'http_status']
});

const Mysql_Query_Latency = new Prometheus.Histogram({
    name: 'mysql_query_latency_seconds',
    help: 'MYSQL Query Latency',
    labelNames: ['query']
});

const Mysql_Query_Count = new Prometheus.Counter({
    name: 'mysql_query_count',
    help: 'Mysql Query Count',
    labelNames: ['query']
});

router.get('/', function (req, res, next) {

    Express_Request_Count.labels(req.method, req.url, 200).inc();

    var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
    Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

    res.status(200).send('Api Works.');

});

router.get('/fast', function (req, res, next) {

    Express_Request_Count.labels(req.method, req.url, 200).inc();

    var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
    Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

    res.status(200).send('Fast response!');
});

router.get('/slow', function (req, res, next) {

    setTimeout(function () {
        Express_Request_Count.labels(req.method, req.url, 200).inc();

        var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
        Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

        res.status(200).send("Slow response...");
    }, 10000);
});

router.get('/error', function (req, res, next) {
    try {
        throw new Error("Something broke...");
    } catch (error) {
        Express_Request_Count.labels(req.method, req.url, 500).inc();

        var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
        Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

        res.status(500).send(error);
    }
});

router.get('/list/:listId', function (req, res, next) {

    Express_Request_Count.labels(req.method, req.url, 200).inc();

    var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
    Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

    res.status(200).send(`Retrieved list ${req.params.listId}`);
});

router.get('/query/fast', function (req, res, next) {

    var sql = "select 1 as id, RAND()*10 as rand union select 2 as id, RAND()*100 as rand";
    var queryrequestTime = Math.floor(Date.now() / 1000);

    setTimeout(function () {

        // Query Latency
        var queryLatency = Math.floor(Date.now() / 1000) - (queryrequestTime);
        Mysql_Query_Latency.labels(sql.substring(0, 50)).observe(queryLatency)

        // Query Count
        Mysql_Query_Count.labels(sql.substring(0, 50)).inc()

        // Request Count
        Express_Request_Count.labels(req.method, req.url, 200).inc();

        // Request Latency
        var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
        Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

        // Response
        res.status(200).send('Fast query response!');
    }, 1000);


});

router.get('/query/slow', function (req, res, next) {

    var sql = "select SLEEP(RAND()*10) as sleeping";
    var queryrequestTime = Math.floor(Date.now() / 1000);

    setTimeout(function () {

        // Query Latency
        var queryLatency = Math.floor(Date.now() / 1000) - (queryrequestTime);
        Mysql_Query_Latency.labels(sql.substring(0, 50)).observe(queryLatency)

        // Query Count
        Mysql_Query_Count.labels(sql.substring(0, 50)).inc()

        // Request Count
        Express_Request_Count.labels(req.method, req.url, 200).inc();

        // Request Latency
        var requestLatency = Math.floor(Date.now() / 1000) - (req.requestTime);
        Express_Request_Latency.labels(req.method, req.url).observe(requestLatency);

        res.status(200).send("Slow query response...");
    }, 5000);
});

module.exports = router;
