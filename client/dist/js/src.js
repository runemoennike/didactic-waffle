angular.module('app',
    [
        'ngRoute',

        'datePicker',
        'ngTagsInput',

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

    }
})();
(function() {
    angular
        .module('publishing')
        .factory('publishingData', dataservice);

    dataservice.$inject = ['$http'];

    function dataservice($http, logger) {
        return {
            list: list,
            create: create,
            read: read,
            update: update,
            remove: remove
        };

        function list() {
            return $http.get('/service/publishing')
                .then(complete);

            function complete(response) {
                return response.data;
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