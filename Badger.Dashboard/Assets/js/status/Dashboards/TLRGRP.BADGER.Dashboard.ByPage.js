(function () {
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.Dashboard.ByPage = function () {
        var isSelected;
        var currentTimePeriod = '1hour';
        var currentSubMetric;

        function getTrafficByGraph() {
            var trafficTypeGraph = {
                id: 'TrafficByType',
                source: 'IIS',
                title: 'Traffic by Type',
                expressions: ['AllTraffic', 'BotTraffic', 'MobileTraffic'],
                filter: function (expression) {
                    return expression.equalTo('pagetype', TLRGRP.BADGER.Pages.get(currentSubMetric).pagetype);
                },
                chartOptions: {
                    dimensions: {
                        margin: { right: 58 }
                    }
                }
            };

            return trafficTypeGraph;
        }

        var getResponseTimeGraph = function(expression) {
            return {
                id: 'ResponseTimeByPage',
                source: 'IIS',
                title: 'Response Time',
                expressions: [expression],
                chartOptions: {
                    dimensions: {
                        margin: { left: 50 }
                    }
                }
            };
        };

        var getErrorsGraph = function () {
            return {
                id: 'AllErrors',
                source: 'Errors',
                title: 'Errors',
                expressions: ['AllErrors'],
                filter: function(expression) {
                    return expression.matchesRegEx('Url', TLRGRP.BADGER.Pages.get(currentSubMetric).regex);
                },
                chartOptions: {
                    legend: false,
                    yAxisLabel: '',
                    dimensions: { margin: { right: 20 } }
                }
            };
        };

        var subMetrics = {
            'HomePage': {
                name: 'Home Page',
                pageType: 'home-page',
                getGraphs: function () {
                    var graphFactory = TLRGRP.BADGER.Dashboard.GraphFactoryNew(currentTimePeriod);
                    return graphFactory.getGraphsFor(getTrafficByGraph(), getResponseTimeGraph('HomePageServerResponseTime'));
                }
            },
            'Search': {
                pageType: 'search',
                getGraphs: function () {
                    var graphFactory = TLRGRP.BADGER.Dashboard.GraphFactoryNew(currentTimePeriod);
                    return graphFactory.getGraphsFor(getTrafficByGraph(),
                        getResponseTimeGraph('SearchServerResponseTime'),
                        getErrorsGraph());
                }
            },
            'HotelDetails': {
                name: 'Hotel Details',
                pageType: 'hotel-details',
                getGraphs: function () {
                    var graphFactory = TLRGRP.BADGER.Dashboard.GraphFactoryNew(currentTimePeriod);
                    return graphFactory.getGraphsFor(getTrafficByGraph(),
                        getResponseTimeGraph('SearchServerResponseTime'),
                        getErrorsGraph());
                }
            },
            'BookingForm': {
                name: 'Booking Form',
                pageType: 'booking-form',
                getGraphs: function () {
                    var graphFactory = TLRGRP.BADGER.Dashboard.GraphFactoryNew(currentTimePeriod);
                    return graphFactory.getGraphsFor(getTrafficByGraph(),
                        getResponseTimeGraph('SearchServerResponseTime'),
                        getErrorsGraph());
                }
            }
        };

        return {
            toString: function () {
                return 'ByPage';
            },
            appendViews: function (allViews) {
                return $.extend(allViews, {
                    'ByPage': {}
                });
            },
            appendViewModel: function (viewModel) {
                viewModel.dashboardViews[viewModel.dashboardViews.length] = {
                    name: 'By Page',
                    metric: 'ByPage',
                    isSelected: isSelected
                };

                if (isSelected) {
                    viewModel.timePeriod = currentTimePeriod;
                    viewModel.pageName = 'By Page';

                    for (var subMetric in subMetrics) {
                        if (!subMetrics.hasOwnProperty(subMetric)) {
                            continue;
                        }

                        viewModel.subMetrics[viewModel.subMetrics.length] = {
                            name: subMetrics[subMetric].name || subMetric,
                            metric: 'ByPage',
                            subMetric: subMetric,
                            isSelected: currentSubMetric === subMetric
                        };
                    }
                }
            },
            supportsView: function (view) {
                return view === 'ByPage';
            },
            setView: function (view, subMetric) {
                isSelected = true;
                currentSubMetric = subMetric || 'HomePage';
                if (subMetrics[currentSubMetric].defaultTimePeriod) {
                    currentTimePeriod = subMetrics[currentSubMetric].defaultTimePeriod;
                }
            },
            clearView: function () {
                isSelected = false;
                currentSubMetric = '';
            },
            setTimePeriod: function (timePeriod) {
                currentTimePeriod = timePeriod;
            },
            getComponents: function () {
                var currentTimitSelectDataString = TLRGRP.BADGER.Cube.convertTimePeriod(currentTimePeriod);

                return subMetrics[currentSubMetric].getGraphs(currentTimitSelectDataString);
            }
        };
    };
})();