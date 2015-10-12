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