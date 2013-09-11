(function () {
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.Dashboard.ByHost = function () {
        var currentTimePeriod = '1hour';
        var currentHost;
        var isSelected;

        return {
            toString: function () {
                return 'Host View';
            },
            supportsView: function (view) {
                return view === 'HostView';
            },
            appendViewModel: function (viewModel) {
                if (isSelected) {
                    viewModel.pageName = 'View Metrics for ' + (currentHost || 'Host');
                    viewModel.timePeriod = currentTimePeriod;
                }

                viewModel.dashboardViews[viewModel.dashboardViews.length] = {
                    name: 'By Server',
                    metric: 'HostView',
                    isSelected: isSelected
                };

                if (isSelected) {
                    var allServers = TLRGRP.BADGER.Machines.getAllServers();
                    var allServerLength = allServers.length;
                    var x;
                    var serverNameRegex = /TELWEB[0]{0,3}([0-9]{1,3})P/;

                    for (x = 0; x < allServerLength; x++) {
                        viewModel.subMetrics[viewModel.subMetrics.length] = {
                            name: allServers[x].replace(serverNameRegex, '$1'),
                            metric: 'HostView',
                            subMetric: allServers[x],
                            isSelected: currentHost === allServers[x]
                        };
                    }
                }
            },
            setView: function (view, subMetric) {
                currentHost = subMetric || 'TELWEB001P';
                isSelected = true;
            },
            clearView: function () {
                isSelected = false;
            },
            setTimePeriod: function (timePeriod) {
                currentTimePeriod = timePeriod;
            },
            getComponents: function () {
                var graphFactory = TLRGRP.BADGER.Dashboard.GraphFactoryNew(currentTimePeriod);
                var bindToHost = function (expression) {
                    return expression.equalTo('source_host', currentHost);
                };
                var chartOptions = {
                    legend: false,
                    dimensions: {
                        margin: {
                            right: 30
                        }
                    }
                };

                return graphFactory.getGraphsFor.apply(this, [{
                        'class': 'half',
                        title: 'Requests Executing',
                        source: 'WMI2',
                        expressions: [{
                            id: 'RequestsExecuting',
                            filter: bindToHost
                        }],
                        chartOptions: chartOptions
                    },
                    {
                        'class': 'half',
                        title: 'CPU',
                        source: 'WMI2',
                        expressions: [{
                            id: 'CPU',
                            filter: bindToHost
                        }],
                        chartOptions: chartOptions
                    },
                    {
                        'class': 'half',
                        title: 'Requests',
                        source: 'IIS',
                        expressions: [{
                            id: 'AllTraffic',
                            filter: bindToHost
                        }],
                        chartOptions: chartOptions
                    },
                    {
                        'class': 'half',
                        title: 'Memory',
                        source: 'WMI2',
                        expressions: [{
                            id: 'Memory',
                            filter: bindToHost
                        }],
                        chartOptions: chartOptions
                    }]);
            }
        };
    };
})();