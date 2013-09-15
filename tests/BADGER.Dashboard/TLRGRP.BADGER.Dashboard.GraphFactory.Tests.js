describe('GraphFactory', function () {
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

			TLRGRP.BADGER.METRIC_SOURCE = { 
				metricInfo: function() {
					var expressionObject = {
						setTimePeriod: function() {
							return expressionObject;
						},
						build: function() {
							return expectedExpression;
						}
					};

					return {
						expression: expressionObject
					};
				}
			};

			var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
			var firstComponent = graphFactory.getGraphsFor({
				source: 'METRIC_SOURCE',
				expressions: ['METRIC']
			})[0];

			expect(firstComponent.expressions[0].expression).to.eql(expectedExpression);
		});
	});  
});