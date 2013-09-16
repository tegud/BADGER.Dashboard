(function() {
	'use strict';

	window.FakeMetricReposistory = function() {
		var registeredSources = [];
		var FakeExpressionObject = function(expression) {
			var expressionObject = {
				setTimePeriod: function() {
					return expressionObject;
				},
				setExpressionStringTo: function(newExpression) {
					expression = newExpression;
					return expressionObject;
				},
				build: function() {
					return expression;
				}
			};

			return expressionObject;
		};

		return {
			reset: function() {
				_(registeredSources).each(function(source) {
					delete TLRGRP.BADGER[source];
				});
			},
			register: function(options) {
				registeredSources[registeredSources.length] = options.source;
				TLRGRP.BADGER[options.source] = {
					metricInfo: function() {
						options.expression = new FakeExpressionObject(options.expression);

						return options;
					}
				};
			}
		};
	};
})();