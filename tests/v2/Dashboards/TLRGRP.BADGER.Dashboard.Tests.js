(function() {
	'use strict';

	before(function() {
		TLRGRP.BADGER.Dashboard.Register({id: 'Overview' });
		TLRGRP.BADGER.Dashboard.Register({id: 'Mobile' });
		TLRGRP.BADGER.Dashboard.Register({id: 'ByPage', name: 'By Page' });
	});

	describe('Available Dashboards', function () {
		describe('getAll', function () {
			it('returns first registered dashboard', function () {
				var allDashboards = TLRGRP.BADGER.Dashboard.getAll();
				expect(allDashboards[0].id).to.be('Overview');
			});

			it('returns second registered dashboard', function () {
				var allDashboards = TLRGRP.BADGER.Dashboard.getAll();
				expect(allDashboards[1].id).to.be('Mobile');
			});
		});
	});

	describe('GetById', function(){
		it('defaults name to id', function () {
			var dashboard = TLRGRP.BADGER.Dashboard.getById('Overview');
			expect(dashboard.name).to.be('Overview');
		});		
	});

	describe('Register dashboard', function() {
		it('defaults name to id', function () {
			var allDashboards = TLRGRP.BADGER.Dashboard.getAll();
			expect(allDashboards[0].name).to.be('Overview');
		});

		it('sets name to name when set', function () {
			var dashboard = TLRGRP.BADGER.Dashboard.getById('ByPage');
			expect(dashboard.name).to.be('By Page');
		});
	});
})();