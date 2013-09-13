(function () {
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.Dashboard.WebHosts = function () {
        function buildSubmetrics(counters) {
            var subMetrics = {};

            _(counters).each(function (counter) {
                subMetrics[counter] = TLRGRP.BADGER.WMI.metricInfo(counter);
            });

            return subMetrics;
        }

        var views = {
            'Requests': {
                defaultSubMetric: 'RequestsExecuting',
                subMetrics: buildSubmetrics(['RequestsExecuting', 'RequestsPerSec', 'ExecutionTime'])
            },
            'Performance': {
                defaultSubMetric: 'CPU',
                subMetrics: buildSubmetrics(['CPU', 'Memory'])
            },
            'Disk': {
                defaultSubMetric: 'DiskSpaceD',
                subMetrics: buildSubmetrics(['DiskSpaceC', 'DiskSpaceD'])
            }
        };
        var currentTimePeriod = '1hour';
        var currentView;
        var currentViewName;
        var currentSubMetric;
        var currentSubMetricName;

        return {
            toString: function () {
                return 'Webhosts';
            },
            supportsView: function (view) {
                if (views[view]) {
                    return true;
                }

                return false;
            },
            appendViewModel: function (viewModel) {
                if (currentViewName) {
                    viewModel.pageName = currentViewName;
                    viewModel.timePeriod = currentTimePeriod;
                }

                for (var view in views) {
                    if (!views.hasOwnProperty(view)) {
                        continue;
                    }

                    viewModel.dashboardViews[viewModel.dashboardViews.length] = {
                        name: views[view].name || view,
                        metric: view,
                        isSelected: view === currentViewName
                    };

                    if (view === currentViewName) {
                        for (var subMetric in currentView.subMetrics) {
                            if (!currentView.subMetrics.hasOwnProperty(subMetric)) {
                                continue;
                            }

                            viewModel.subMetrics[viewModel.subMetrics.length] = {
                                name: currentView.subMetrics[subMetric].name || subMetric,
                                metric: view,
                                subMetric: subMetric,
                                isSelected: currentSubMetricName === subMetric
                            };
                        }
                    }
                }
            },
            setView: function (view, subMetric) {
                var selectedView = views[view];
                var selectedSubmetric = subMetric || selectedView.defaultSubMetric;

                currentViewName = view;
                currentView = selectedView;
                currentSubMetric = currentView.subMetrics[selectedSubmetric];
                currentSubMetricName = selectedSubmetric;

                if (currentSubMetric.defaults && currentSubMetric.defaults.timePeriod) {
                    currentTimePeriod = currentSubMetric.defaults.timePeriod;
                }
            },
            clearView: function () {
                currentViewName = '';
                currentView = '';
                currentSubMetric = '';
            },
            setTimePeriod: function (timePeriod) {
                currentTimePeriod = timePeriod;
            },
            getComponents: function () {
                var maxPerGroup = 5;
                var metricGroups = [];
                var currentMetricGroup = -1;
                var webBoxes = TLRGRP.BADGER.Machines.getServerRange('web');
                var webBoxesLength = webBoxes.length;
                var serverNameRegex = /TELWEB[0]{0,3}([0-9]{1,3})P/;
                var getServerInteger = function(server) {
                    return parseInt(server.replace(serverNameRegex, '$1'), 10);
                };

                for (var i = 0; i < webBoxesLength; i++) {
                    if (!(i % maxPerGroup)) {
                        metricGroups[++currentMetricGroup] = [];
                    }

                    metricGroups[currentMetricGroup][metricGroups[currentMetricGroup].length] = webBoxes[i];
                }

                return _(metricGroups).map(function (serverGroup) {
                    var title = currentSubMetric.name + ' by hosts ';
                    
                    var graphFactory = TLRGRP.BADGER.Dashboard.GraphFactoryNew(currentTimePeriod);

                    return graphFactory.getGraphsFor({
                        'class': 'half',
                        title: title + _(serverGroup).min(getServerInteger) + ' - ' + _(serverGroup).max(getServerInteger),
                        source: 'WMI2',
                        expressions: _(serverGroup).map(function (server) {
                            return {
                                id: currentSubMetricName,
                                title: server,
                                filter: function(expression) {
                                    return expression.equalTo('source_host', server);
                                }
                            };
                        })
                    })[0];
                });
            }
        };
    };
})();