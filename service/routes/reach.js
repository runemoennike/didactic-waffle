var express = require('express');
var router = express.Router();
var _ = require('underscore');
var socket = require('../socket');

// The data.
var data = require('../data/reach.json')['response'];
if (typeof data === 'undefined') data = [];

// List items.
router.get('/', function (req, res, next) {
    res.send(data);
});

// Append item.
router.post('/', function (req, res, next) {
    var item = req.body;

    data.push(item);
    socket.getIo().emit('create reach', item);

    res.sendStatus(200);
});

module.exports = router;