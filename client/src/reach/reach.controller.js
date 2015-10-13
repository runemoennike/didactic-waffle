(function () {
    angular
        .module('reach')
        .controller('ReachController', controller);

    controller.$inject = [
        '$scope',
        'reachData'
    ];

    function controller($scope, reachData) {

        var vm = {};

        vm.datapoints = void 0;
        vm.create = create;
        vm.graphOptions = {
            logarithmicScale: false,
            showTotal: true,
            showOrganic: true,
            showViral: true,
            showPaid: true
        };

        activate();

        return vm;

        //////////////////////////////////////

        function activate() {
            getDatapoints();

            // Get noticed when the a datapoint is added on the service.
            reachData.onListChanged(messageReceivedDatapointAdded);
            reachData.subscribe($scope);

        }

        function getDatapoints() {
            reachData.list()
                .then(function (data) {
                    vm.datapoints = data;
                });
        }

        function create(impressions) {
            var sum = impressions.organic + impressions.viral + impressions.paid;
            var item = {
                post_impressions: [
                    {value: sum}
                ],
                post_impressions_organic: [
                    {value: impressions.organic}
                ],
                post_impressions_viral: [
                    {value: impressions.viral}
                ],
                post_impressions_paid: [
                    {value: impressions.paid}
                ]
            }
            reachData.create(item);
        }

        function messageReceivedDatapointAdded(list) {
            vm.datapoints = list;
            $scope.$apply();
        }

    }
})();