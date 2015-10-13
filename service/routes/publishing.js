var express = require('express');
var router = express.Router();
var _ = require('underscore');
var uuid = require('node-uuid');
var socket = require('../socket');

// The data.
var data = require('../data/publishing.json');
if (typeof data === 'undefined') data = [];

// List items.
router.get('/', function (req, res, next) {
    res.send(data);
});

// Create item.
router.post('/', function (req, res, next) {
    var item = req.body;
    item.id = uuid.v4();

    data.push(item);
    socket.getIo().emit('create publishing', item);

    // Send item back so client can read id.
    res.send(item);
});

// Read item.
router.get('/:id', function (req, res, next) {
    var item = _(data).findWhere({id: req.params.id});

    res.send(item);
});

// Update item.
router.put('/:id', function (req, res, next) {
    var index = _(data).findIndex(function (el) {
        return el.id === req.params.id;
    });

    if (index !== -1) {
        data[index] = req.body;

        socket.getIo().emit('update publishing', data[index]);

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }

});

// Delete item.
router.delete('/:id', function (req, res, next) {
    var index = _(data).findIndex(function (el) {
        return el.id === req.params.id;
    });

    if (index !== -1) {
        socket.getIo().emit('delete publishing', data[index]);

        data.splice(index, 1);

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }

});

module.exports = router;