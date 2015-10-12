(function () {
    angular
        .module('socket')
        .run(run);

    run.$inject = [
        'socket'
    ];

    function run(socket) {
        socket.connect();
    }
})();