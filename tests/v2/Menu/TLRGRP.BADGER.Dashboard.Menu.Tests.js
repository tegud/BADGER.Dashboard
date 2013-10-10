(function() {
	'use strict';

	function setupDOMFixture() {
		$('body').append('<nav id="dashboard-menu"><ul class="status-menu"><li class="top-level-item text">V2</li></ul></nav>');
	}

	before(TLRGRP.messageBus.setUpClearDown);

	beforeEach(function() {
		setupDOMFixture();
	});

	afterEach(function() {
		$('#dashboard-menu').remove();
	});

	describe('Dashboard Menu', function () {
		describe('sets available dashboards', function () {
			it('sets first dashboard name to overview', function () {
				var expectedTitle = 'Overview';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:first', menuElement).text()).to.be(expectedTitle);
			});

			it('sets second dashboard name to mobile', function() {
				var expectedTitle = 'Mobile';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:eq(1)', menuElement).text()).to.be(expectedTitle);
			});

			it('sets second dashboard name to requests', function() {
				var expectedTitle = 'Requests';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:eq(2)', menuElement).text()).to.be(expectedTitle);
			});

			it('sets second dashboard name to performance', function() {
				var expectedTitle = 'Performance';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:eq(3)', menuElement).text()).to.be(expectedTitle);
			});

			it('sets second dashboard name to disk', function() {
				var expectedTitle = 'Disk';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:eq(4)', menuElement).text()).to.be(expectedTitle);
			});

			it('sets second dashboard name to by server', function() {
				var expectedTitle = 'By Server';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:eq(5)', menuElement).text()).to.be(expectedTitle);
			});

			it('sets second dashboard name to by page', function() {
				var expectedTitle = 'By Page';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) option:eq(6)', menuElement).text()).to.be(expectedTitle);
			});
		});

		describe('initially selected dashboard', function() {
			it('sets current dashboard text', function() {
				var expectedTitle = 'Overview';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(1) .current-item', menuElement).text()).to.be(expectedTitle);
			});
		});

		describe('different dashboard is selected', function() {
			it('publishes TLRGRP.BADGER.Dashboard.Selected event with specified dashboard id', function() {
				var expectedDashboardId = 'ByPage';
				var actualDashboardId;
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);
				var select = $('.top-level-item:eq(1) select', menuElement);

				TLRGRP.messageBus.subscribe('TLRGRP.BADGER.Dashboard.Selected', function(selectedDashboard) {
					actualDashboardId = selectedDashboard.id;
				});

				select[0].selectedIndex = 6;
				select.change();

				expect(actualDashboardId).to.be(expectedDashboardId);
			});
		});

		describe('dashboard is selected', function() {
			it('sets current dashboard text', function() {
				var expectedTitle = 'By Page';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
					id: 'ByPage'
				});

				expect($('.top-level-item:eq(1) .current-item', menuElement).text()).to.be(expectedTitle);
			});
		});

		describe('initial dashboard views are set', function() {
			it('sets the first view name', function() {
				var expectedView = 'Summary';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(2) option:first', menuElement).text()).to.be(expectedView);
			});

			it('sets the second view name', function() {
				var expectedView = 'Traffic';
				var menuElement = $('#dashboard-menu');
				var menu = new TLRGRP.BADGER.Dashboard.Menu(menuElement);

				expect($('.top-level-item:eq(2) option:eq(1)', menuElement).text()).to.be(expectedView);
			});
		});
	});
})();