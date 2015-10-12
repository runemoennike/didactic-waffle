(function (io) {
    angular
        .module('socket')
        .factory('socket', service);

    service.$inject = [

    ];

    function service() {
        var socket;

        return {
            connect: connect,
            on: on,
            removeAllListeners: removeAllListeners
        }

        function on(event, fn) {
            return socket.on(event, fn);
        }

        function removeAllListeners(event) {
            return socket.removeAllListeners(event);
        }

        function connect() {
            socket = io.connect();
            return socket;
        }
    }
})(io);