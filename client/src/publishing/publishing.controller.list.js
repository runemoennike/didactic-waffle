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