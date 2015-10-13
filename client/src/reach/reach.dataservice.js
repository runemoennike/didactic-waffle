(function () {
    angular
        .module('reach')
        .factory('reachData', dataservice);

    dataservice.$inject = [
        '$http',
        'socket'
    ];

    function dataservice($http, socket) {
        var listContainer = [];
        var onListChangedFn;

        return {
            list: list,
            create: create,
            onListChanged: onListChanged,
            subscribe: subscribe,
        };

        function list() {
            return $http.get('/service/reach')
                .then(complete);

            function complete(response) {
                listContainer = response.data;
                return listContainer;
            }
        }

        function create(item) {
            return $http.post('/service/reach', item)
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }

        /**
         * @param fn Function to call when the list of items has changed.
         */
        function onListChanged(fn) {
            onListChangedFn = fn;
        }

        /**
         * Subscribe to item changes via Socket.IO.
         * @param [$scope] Supply to automatically unsubscribe on $scope disposal.
         */
        function subscribe($scope) {
            socket.on('create reach', function (item) {
                listContainer.push(item);

                if (typeof(onListChangedFn) !== 'undefined') {
                    onListChangedFn(listContainer);
                }
            });

            // Clean up.
            if(typeof($scope) !== 'undefined') {
                $scope.$on("$destroy", function () {
                    unsubscribe();
                });
            }
        }

        function unsubscribe() {
            socket.removeAllListeners("create reach");
        }
    }
})();