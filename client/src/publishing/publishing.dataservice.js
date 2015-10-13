(function () {
    angular
        .module('publishing')
        .factory('publishingData', dataservice);

    dataservice.$inject = [
        '$http',
        'socket'
    ];

    function dataservice($http, socket) {
        var listContainer = [];
        var onListChangedFn;
        var onItemChangedFn;

        return {
            list: list,
            create: create,
            read: read,
            update: update,
            remove: remove,
            onListChanged: onListChanged,
            onItemChanged: onItemChanged,
            subscribe: subscribe,
        };

        function list() {
            return $http.get('/service/publishing')
                .then(complete);

            function complete(response) {
                listContainer = response.data;
                return listContainer;
            }
        }

        function create() {
            var item = {
                content: {
                    message: 'Unnamed Publishing',
                    network: 'facebook'
                },
                scheduled: (new Date()).toISOString()
            };

            return $http.post('/service/publishing', item)
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }

        function read(id) {
            return $http.get('/service/publishing/' + id)
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }

        function update(item) {
            return $http.put('/service/publishing/' + item.id, item)
                .then(complete);

            function complete(response) {
                console.log("Saved.");
            }
        }

        function remove(item) {
            return $http.delete('/service/publishing/' + item.id)
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
         * @param fn Function to call when a single item has changed.
         */
        function onItemChanged(fn) {
            onItemChangedFn = fn;
        }

        /**
         * Subscribe to item changes via Socket.IO.
         * @param [$scope] Supply to automatically unsubscribe on $scope disposal.
         */
        function subscribe($scope) {
            socket.on('create publishing', function (item) {
                listContainer.push(item);

                if (typeof(onListChangedFn) !== 'undefined') {
                    onListChangedFn(listContainer);
                }
            });

            socket.on('update publishing', function (item) {
                var idx = _(listContainer).findIndex(function (el) {
                    return el.id == item.id;
                });

                if(idx !== -1) {
                    listContainer[idx] = item;
                }

                if (typeof(onListChangedFn) !== 'undefined') {
                    onListChangedFn(listContainer);
                }
                if (typeof(onItemChangedFn) !== 'undefined') {
                    onItemChangedFn(item);
                }
            });

            socket.on('delete publishing', function (item) {
                var idx = _(listContainer).findIndex(function (el) {
                    return el.id == item.id;
                });

                if(idx !== -1) {
                    listContainer.splice(idx, 1);
                }

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
            socket.removeAllListeners("create publishing");
            socket.removeAllListeners("update publishing");
            socket.removeAllListeners("delete publishing");
        }
    }
})();