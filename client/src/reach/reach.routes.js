(function() {
    angular
        .module('reach')
        .config(routeConfig);

    routeConfig.$inject = [
        '$routeProvider',
    ];

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/reach', {
                templateUrl: 'src/reach/reach.html',
                controller: 'ReachController',
                controllerAs: 'vm'
            });
    }
})();