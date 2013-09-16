(function() {
	'use strict';

	var FakeMetricReposistory = function() {
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

	describe('GraphFactory', function () {
		var fakeMetricRepository = new FakeMetricReposistory();

		afterEach(function() {
			fakeMetricRepository.reset();
		});

		describe('getGraphsFor', function () {
			it('sets title', function () {
				var expectedTitle = 'GraphTitle';
				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					title: expectedTitle
				})[0];

				expect(firstComponent.title).to.eql(expectedTitle);
			});

			it('sets class', function() {
				var expectedClass = 'GraphTitle';
				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					'class': expectedClass
				})[0];

				expect(firstComponent.class).to.eql(expectedClass);
			});

			it('sets expression cube expression for known source and expression', function() {
				var expectedExpression = 'CUBE EXPRESSION';

				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					expression: expectedExpression
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					expressions: ['METRIC']
				})[0];

				expect(firstComponent.expressions[0].expression).to.eql(expectedExpression);
			});

			it('defaults to first expression color ', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC'
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					expressions: ['METRIC']
				})[0];

				expect(firstComponent.expressions[0].color).to.eql('steelblue');
			});

			it('defaults to second expression color', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					expression: 'CUBE EXPRESSION'
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					expressions: ['METRIC', 'METRIC']
				})[0];

				expect(firstComponent.expressions[1].color).to.eql('red');
			});

			it('expression lookup set from expression object definition', function() {
				var expectedExpression = 'CUBE EXPRESSION';

				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					expression: expectedExpression
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					expressions: [
							{ 
								id: 'METRIC' 
							}
						]
				})[0];

				expect(firstComponent.expressions[0].expression).to.eql(expectedExpression);
			});

			it('sets expression graphType to specified graph value', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					expression: 'CUBE EXPRESSION'
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					graphType: 'stackedArea',
					expressions: [
							{ 
								id: 'METRIC' 
							}
						]
				})[0];

				expect(firstComponent.expressions[0].graphType).to.eql('stackedArea');
			});

			it('sets expression graphType to specified expression value', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					expression: 'CUBE EXPRESSION'
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					graphType: 'stackedArea',
					expressions: [
							{ 
								id: 'METRIC', 
								graphType: 'line'
							}
						]
				})[0];

				expect(firstComponent.expressions[0].graphType).to.eql('line');
			});

			it('sets expression id', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					expression: 'CUBE EXPRESSION'
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					graphType: 'stackedArea',
					expressions: [
							{ 
								id: 'METRIC', 
								graphType: 'line'
							}
						]
				})[0];

				expect(firstComponent.expressions[0].id).to.eql('METRIC-0');
			});

			it('sets default chart options', function() {
				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					graphType: 'stackedArea',
					expressions: []
				})[0];

				expect(firstComponent.chartOptions).to.eql({
					lockToZero: true
				});
			});

			it('sets chart options to specified value', function() {
				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					graphType: 'stackedArea',
					expressions: [],
					chartOptions: {
						anotherProperty: 'x'
					}
				})[0];

				expect(firstComponent.chartOptions).to.eql({
					lockToZero: true,
					anotherProperty: 'x'
				});
			});

			it('sets chart options from expression', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					chartOptions: {
						yAxisLabel: 'label'
					}
				});

				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					source: 'METRIC_SOURCE',
					graphType: 'stackedArea',
					expressions: ['METRIC']
				})[0];

				expect(firstComponent.chartOptions).to.eql({
					lockToZero: true,
					yAxisLabel: 'label'
				});
			});

			it('sets multiple graphs', function() {
				var expectedTitle = 'GraphTitle';
				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var secondComponent = graphFactory.getGraphsFor({
					title: 'graph one'
				}, 
				{
					title: expectedTitle
				})[1];

				expect(secondComponent.title).to.eql(expectedTitle);
			});

			it('applies expression filter', function() {
				fakeMetricRepository.register({
					source: 'METRIC_SOURCE',
					metric: 'METRIC',
					chartOptions: {
						yAxisLabel: 'label'
					}
				});

				var expectedExpression = 'filterCalled';
				var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
				var firstComponent = graphFactory.getGraphsFor({
					expressions: [{
						id: 'METRIC',
						source: 'METRIC_SOURCE',
						filter: function(expression) {
							return expression.setExpressionStringTo(expectedExpression);
						}
					}]
				})[0];

				expect(firstComponent.expressions[0].expression).to.eql(expectedExpression);
			});
		});
	});
})();