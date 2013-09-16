(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.GraphFactory');

    TLRGRP.BADGER.Dashboard.GraphFactoryNew = function (currentTimePeriod) {
        var colors = new TLRGRP.BADGER.ColorPalette();
        var chartOptions = {
            lockToZero: true
        };
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
                    chartOptions: $.extend.apply(null, [{}, chartOptions].concat(allChartOptions).concat([graph.chartOptions]))
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
})();