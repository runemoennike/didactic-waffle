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