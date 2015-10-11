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