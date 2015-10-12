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

            // Get noticed when the item changes on the service.
            publishingData.onItemChanged(messageReceivedItemChanged);
            publishingData.subscribe();

            // Clean up.
            $scope.$on("$destroy", function() {
                publishingData.unsubscribe();
            });

            // The datepicker does not correctly trigger ng-change.
            $scope.$watch('vm.publishing.scheduled', function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    dataChanged();
                }
            })
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