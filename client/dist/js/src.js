angular.module('app',
    [
        'ngRoute',

        'datePicker',
        'ngTagsInput',

        'socket',
        'navigation',
        'home',
        'publishing',
        'reach',
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
        'ngRoute',
        'socket'
    ]);
angular.module('reach',
    [
        'ngRoute',
        'socket'
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
        vm.uiDataChanged = uiDataChanged;

        activate();

        return vm;

        //////////////////////////////////////

        function activate() {
            getPublishing();

            // Get noticed when the item changes on the service.
            publishingData.onItemChanged(messageReceivedItemChanged);
            publishingData.subscribe($scope);

            // The datepicker does not correctly trigger ng-change.
            $scope.$watch('vm.publishing.scheduled', function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    uiDataChanged();
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

        function uiDataChanged() {
            vm.saved = false;

            publishingData
                .update(vm.publishing)
                .then(function() {
                    vm.saved = true;
                });
        }

        function messageReceivedItemChanged(item) {
            if(item.id === vm.publishing.id) {
                vm.publishing = item;
                $scope.$apply();
            }
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

            // Get noticed when the list changes on the service.
            publishingData.onListChanged(messageReceivedListChanged);
            publishingData.subscribe($scope);

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
                scheduled: (new Date()).toISOString(),
                tags: [],
                channels: [],
                geo: {
                    countries: [],
                    languages: [],
                    cities: [],
                    regions: []
                }
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
(function () {
    angular
        .module('reach')
        .factory('reachData', dataservice);

    dataservice.$inject = [
        '$http',
        'socket'
    ];

    function dataservice($http, socket) {
        var listContainer = [];
        var onListChangedFn;

        return {
            list: list,
            create: create,
            onListChanged: onListChanged,
            subscribe: subscribe,
        };

        function list() {
            return $http.get('/service/reach')
                .then(complete);

            function complete(response) {
                listContainer = response.data;
                return listContainer;
            }
        }

        function create(item) {
            return $http.post('/service/reach', item)
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
         * Subscribe to item changes via Socket.IO.
         * @param [$scope] Supply to automatically unsubscribe on $scope disposal.
         */
        function subscribe($scope) {
            socket.on('create reach', function (item) {
                listContainer.push(item);

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
            socket.removeAllListeners("create reach");
        }
    }
})();
(function (d3) {
    angular
        .module('reach')
        .directive('reachGraph', directive);

    directive.$inject = [
        '$window'
    ];

    function directive($window) {

        // Constants
        var aspectRatio = 4.0 / 3.0;
        var margin = {
            top: 10,
            bottom: 30,
            left: 70,
            right: 10,
        };

        // Privates
        var graph;
        var width, height;
        var graphOptions;
        var datapoints;

        return {
            link: link,
            restrict: 'EA',
            scope: {
                datapoints: '=',
                graphOptions: '=',
            }
        };

        function link(scope, elements, attrs) {
            var directiveElement = elements[0];
            createGraphElement(directiveElement);

            graphOptions = scope.graphOptions;

            // Watch for changes in datapoints.
            scope.$watchCollection('datapoints', function (newVal, oldVal) {
                if (newVal) {
                    datapoints = newVal;
                    redrawGraph();
                }
            });

            // Watch for changes in options.
            scope.$watch('graphOptions', function (newVal, oldVal) {
                redrawGraph();
            }, true);

            // Watch for viewport resize.
            var resizeHandler = function () {
                updateSize(directiveElement);
                redrawGraph();
            };
            angular.element($window).on('resize', resizeHandler);
            scope.$on('$destroy', function() {
                angular.element($window).off('resize', resizeHandler);
            })
        }

        function createGraphElement(element) {
            graph = d3.select(element)
                .append('svg');

            updateSize(element);
        }

        function updateSize(element) {
            width = element.offsetWidth;
            height = width / aspectRatio;

            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;

            graph.attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);
        }

        function redrawGraph() {
            if (!datapoints) {
                return;
            }

            // Add index to all datapoints to use as X-coordinate.
            _(datapoints).forEach(function (d, idx) {
                d._idx = idx;
            });

            // Filter out empty datapoints.
            datapoints = _(datapoints).reject(function (d) {
                return !d.post_impressions;
            });

            // Clear all datapoints.
            graph.selectAll('*').remove();

            // See http://bl.ocks.org/mbostock/3884955 .
            var x = d3.scale.linear()
                .range([0, width])
                .domain(d3.extent(datapoints, function (d) {
                    return d._idx;
                }));

            var y = (graphOptions.logarithmicScale ? d3.scale.log() : d3.scale.linear())
                .clamp(true)
                .range([height, 1])
                .domain([1,
                    d3.max(datapoints, function (d) {
                            return Number(d.post_impressions[0].value)
                        }
                    )
                ])
                .nice();

            var xAxis = d3.svg.axis().scale(x).orient('bottom');
            var yAxis = d3.svg.axis().scale(y).orient('left');

            var lineFactory = function (accessorFn) {
                return d3.svg.line()
                    .x(function (d) {
                        return x(d._idx)
                    })
                    .y(function (d) {
                        return y(Number(accessorFn(d).value));
                    });
            };

            var totalImpressionsLine = lineFactory(function (d) {
                return d.post_impressions[0];
            });

            var organicImpressionsLine = lineFactory(function (d) {
                return d.post_impressions_organic[0];
            });

            var viralImpressionsLine = lineFactory(function (d) {
                return d.post_impressions_viral[0];
            });

            var paidImpressionsLine = lineFactory(function (d) {
                return d.post_impressions_paid[0];
            });

            var graphingArea = graph.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            graphingArea.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            graphingArea.append("g")
                .attr("class", "y axis")
                .call(yAxis);


            if (graphOptions.showTotal) {
                graphingArea.append('path')
                    .datum(datapoints)
                    .attr('class', 'line line-total-impressions')
                    .attr('d', totalImpressionsLine);
            }

            if (graphOptions.showOrganic) {
                graphingArea.append('path')
                    .datum(datapoints)
                    .attr('class', 'line line-organic-impressions')
                    .attr('d', organicImpressionsLine);
            }

            if (graphOptions.showViral) {
                graphingArea.append('path')
                    .datum(datapoints)
                    .attr('class', 'line line-viral-impressions')
                    .attr('d', viralImpressionsLine);
            }

            if (graphOptions.showPaid) {
                graphingArea.append('path')
                    .datum(datapoints)
                    .attr('class', 'line line-paid-impressions')
                    .attr('d', paidImpressionsLine);
            }
        }

    }
})(d3);
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