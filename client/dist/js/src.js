angular.module('app',
    [
        'ngRoute',

        'datePicker',
        'ngTagsInput',

        'socket',
        'navigation',
        'home',
        'publishing',
    ]);
angular.module('home',
    [
        'ngRoute'
    ]);
angular.module('navigation',
    [
        'ngRoute'
    ]);
angular.module('publishing',
    [
        'ngRoute'
    ]);
angular.module('socket',
    [
    ]);
(function() {
    angular
        .module('app')
        .config(['$routeProvider', '$locationProvider', routeConfig]);

    routeConfig.$inject = [
        '$routeProvider',
        '$locationProvider'
    ];

    function routeConfig($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
    }
})();
(function() {
    angular
        .module('home')
        .controller('HomeController', controller);

    controller.$inject = [
    ];

    function controller() {

        var vm = {};

        activate();

        return vm;

        //////////////////////////////////////

        function activate() {

        }

    }
})();
(function() {
    angular
        .module('home')
        .config(routeConfig);

    routeConfig.$inject = [
        '$routeProvider',
    ];

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            });
    }
})();
(function() {
    angular
        .module('navigation')
        .controller('NavigationController', controller);

    controller.$inject = [
    ];

    function controller() {

        var vm = {};

        activate();

        return vm;

        //////////////////////////////////////

        function activate() {

        }

    }
})();
(function () {
    angular
        .module('publishing')
        .controller('PublishingEditController', controller);

    controller.$inject = [
        '$scope',
        '$routeParams',
        'publishingData'
    ];

    function controller($scope, $routeParams, publishingData) {

        var vm = {};
        var dataLoaded = false;

        vm.publishing = void 0;
        vm.dataChanged = dataChanged;

        activate();

        return vm;

        //////////////////////////////////////

        function activate() {
            getPublishing();

            publishingData.onItemChanged(messageReceivedItemChanged);
            publishingData.subscribe();

            $scope.$on("$destroy", function() {
                publishingData.unsubscribe();
            });
        }

        function getPublishing() {
            var id = $routeParams.id;

            publishingData.read(id)
                .then(function (data) {
                    vm.publishing = data;
                    dataLoaded = true;
                });
        }

        function dataChanged() {
            publishingData.update(vm.publishing);
        }

        function messageReceivedItemChanged(item) {
            vm.publishing = item;
            $scope.$apply();
        }
    }
})();
(function() {
    angular
        .module('publishing')
        .controller('PublishingListController', controller);

    controller.$inject = [
        '$scope',
        '$location',
        'publishingData'
    ];

    function controller($scope, $location, publishingData) {

        var vm = {};

        vm.publishings = void 0;
        vm.create = create;
        vm.remove = remove;

        activate();

        return vm;

        //////////////////////////////////////

        function activate() {
            getPublishings();

            publishingData.onListChanged(messageReceivedListChanged);
            publishingData.subscribe();

            $scope.$on("$destroy", function() {
                publishingData.unsubscribe();
            });
        }

        function getPublishings() {
            publishingData.list()
                .then(function(data) {
                   vm.publishings = data;
                });
        }

        function create() {
            publishingData.create()
                .then(function(data) {
                    $location.path('publishing/' + data.id);
                });
        }

        function remove(item) {
            publishingData.remove(item)
                .then(function(data) {
                    var idx = _(vm.publishings).indexOf(item);

                    if(idx !== -1) {
                        vm.publishings.splice(idx, 1);
                    }
                });
        }

        function messageReceivedListChanged(list) {
            vm.publishings = list;
            $scope.$apply();
        }

    }
})();
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
            unsubscribe: unsubscribe
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

        function onListChanged(fn) {
            onListChangedFn = fn;
        }

        function onItemChanged(fn) {
            onItemChangedFn = fn;
        }

        function subscribe() {
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
        }

        function unsubscribe() {
            socket.removeAllListeners("create publishing");
            socket.removeAllListeners("update publishing");
            socket.removeAllListeners("delete publishing");
        }
    }
})();
(function() {
    angular
        .module('publishing')
        .config(routeConfig);

    routeConfig.$inject = [
        '$routeProvider',
    ];

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/publishing', {
                templateUrl: 'src/publishing/publishing.list.html',
                controller: 'PublishingListController',
                controllerAs: 'vm'
            });

        $routeProvider
            .when('/publishing/:id', {
                templateUrl: 'src/publishing/publishing.edit.html',
                controller: 'PublishingEditController',
                controllerAs: 'vm'
            });

    }
})();
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