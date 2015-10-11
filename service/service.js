var publishingRoutes = require('./routes/publishing');
var reachRoutes = require('./routes/reach');
var bodyParser = require('body-parser');

var service = {
    init: init
};

function init(app) {
    // Post data.
    app.use(bodyParser.json());

    // Data routes.
    app.use('/service/publishing', publishingRoutes);
    app.use('/service/reach', reachRoutes);
}

module.exports = service;