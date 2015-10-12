var socketio = require('socket.io');
var io;

module.exports = {
    init: init,
    getIo: getIo
};

function init(app) {
    io = socketio.listen(app);

    io.sockets.on('connection', function (socket) {
        console.log("Socket connection: " + socket.id);
    });
}

function getIo() {
    return io;
}