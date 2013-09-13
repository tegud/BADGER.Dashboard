(function () {
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.GraphFactory');

    TLRGRP.BADGER.Dashboard.GraphFactoryNew = function (currentTimePeriod) {
        var chartOptions = {
            lockToZero: true
        };
        var colors = new TLRGRP.BADGER.ColorPalette();
        var noCustomFilter = function(expression) {
            return expression;
        };

        function getGraphsFor() {
            function getGraphFor(graph) {
                var currentTimitSelectDataString = TLRGRP.BADGER.Cube.convertTimePeriod(currentTimePeriod);
                var allChartOptions = [];
                var graphType = graph.graphType;

                return $.extend(true, {}, graph, {
                    'class': graph.class,
                    title: graph.title,
                    expressions: _.map(graph.expressions, function (expression, i) {
                        if (typeof expression === "string") {
                            expression = { id: expression };
                        }

                        var expressionObject = TLRGRP.BADGER[expression.source || graph.source].metricInfo(expression.id);
                        var expressionBuilder = (expression.filter || noCustomFilter)(expressionObject.expression.setTimePeriod(currentTimitSelectDataString));

                        allChartOptions[allChartOptions.length] = expressionObject.chartOptions;
                        
                        return $.extend(true,
                            {
                                color: colors.getColorByKey(expression, i),
                                graphType: graphType
                            },
                            expressionObject,
                            expression,
                            {
                                expression: expressionBuilder.build(),
                                id: expression.id + '-' + i
                            });
                    }),
                    chartOptions: $.extend.apply(this, [{}, chartOptions].concat(allChartOptions).concat([graph.chartOptions]))
                });
            }

            return _.map(arguments, function(graphItem) {
                return getGraphFor(graphItem);
            });
        }

        return {
            getGraphsFor: getGraphsFor
        };
    };

    TLRGRP.BADGER.Dashboard.GraphFactory = function (currentTimePeriod) {
        var chartOptions = {
            lockToZero: true
        };

        function getGraphsFor() {
            function getGraphFor(graph) {
                var graphClass;
                var instanceChartOptions = graph.chartOptions;
                var expressionFilter = graph.expressions;
                var additionalExpressionFilters = graph.additionalExpressionFilters;
                var graphTitle = graph.title;
                var graphType = graph.graphType;

                if (typeof graph === 'object') {
                    if (graph.slots === 2) {
                        graphClass = 'half';
                    }
                    graph = graph.id;
                }

                var selectedGraph = TLRGRP.BADGER.Dashboard.Graphs.get(graph);
                var currentTimitSelectDataString = TLRGRP.BADGER.Cube.convertTimePeriod(currentTimePeriod);
                var selectedExpressions = selectedGraph.expressions;

                if (expressionFilter && expressionFilter) {
                    selectedExpressions = _(selectedExpressions).filter(function (graphExpression) {
                        if (_(expressionFilter).contains(graphExpression.id)) {
                            return graphExpression;
                        }
                    });
                }

                delete selectedGraph.expressions;

                return $.extend(true, {}, selectedGraph, {
                    'class': graphClass,
                    title: graphTitle,
                    expressions: _.map(selectedExpressions, function (expression) {
                        var currentExpression = expression.expression;
                        currentExpression = currentExpression.setTimePeriod(currentTimitSelectDataString);

                        if (additionalExpressionFilters) {
                            _(additionalExpressionFilters).each(function (expressionFilter) {
                                currentExpression = currentExpression[expressionFilter.filter](expressionFilter.key, expressionFilter.value);
                            });
                        }

                        expression.expression = currentExpression.build();

                        if (!expression.id) {
                            var autoTitle = (selectedGraph.title ? selectedGraph.title + '-' : '') + expression.title;
                            expression.id = autoTitle.toLowerCase().replace(/\s/g, '-').replace(/[()]/g, '');
                        }
                        
                        expression.graphType = expression.graphType || selectedGraph.graphType || graphType;

                        return expression;
                    }),
                    chartOptions: $.extend({}, chartOptions, selectedGraph.chartOptions, instanceChartOptions)
                });
            }

            return _.map(arguments, function (graphItem) {
                return getGraphFor(graphItem);
            });
        }

        return {
            getGraphsFor: getGraphsFor
        };
    };
})();