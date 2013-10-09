(function() {
	'use strict';

	describe('Dashboard Menu', function () {
		describe('sets available dashboards', function () {
			it('sets first dashboard name to overview', function () {
				var expectedTitle = 'Overview';
				var graphFactory = new TLRGRP.BADGER.Dashboard.Menu();

				expect(firstComponent.title).to.eql(expectedTitle);
			});
		});
	});
})();