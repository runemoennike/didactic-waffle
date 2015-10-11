angular.module('app',
    [
        'ngRoute',

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
(function() {
    angular
        .module('publishing')
        .controller('PublishingListController', controller);

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
    }
})();