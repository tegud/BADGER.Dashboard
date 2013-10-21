(function() {
	'use strict';

	describe('Dashboard Loader', function () {
		LOADING.show = function() { };
		LOADING.hide = function() { };
		
		new TLRGRP.BADGER.Dashboard.PageManager();

		beforeEach(function() {
			TLRGRP.BADGER.Dashboard.clear();
			TLRGRP.BADGER.Dashboard.register({
				id: 'Overview',
				views: [{
					id: 'Summary',
					name: 'Summary',
					components: [
						{
							render: function() {
								return '<div id="component-one"></div>';
							} 
						},
						{
							render: function() {
								return '<div id="component-two"></div>';
							} 
						}
					]
				}, {
					id: 'Traffic',
					name: 'Traffic'
				}]
			});

			$('#dashboard-container').remove();
			$('body').append($('<div />', { id: 'dashboard-container' }));
		});

		it('is initially loading', function() {
			var loadingDisplayed = false;

			LOADING.show = function() {
				loadingDisplayed = true;
			};

			new TLRGRP.BADGER.Dashboard.Loader($('#dashboard-container'));

			expect(loadingDisplayed).to.be(true);
		});

		describe('when dashboard and view is selected', function () {
			it('Loading screen is shown', function () {
				var loadingDisplayed = false;

				LOADING.show = function() {
					loadingDisplayed = true;
				};

				new TLRGRP.BADGER.Dashboard.Loader($('#dashboard-container'));

                TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
                    dashboard: 'Overview'
                });

				expect(loadingDisplayed).to.be(true);
			});

			it('sets dashboard container html to component generated html', function() {
				var expectedHtml = '<div id="component-one"></div><div id="component-two"></div>';
				var dashboardContainer = $('#dashboard-container');

				new TLRGRP.BADGER.Dashboard.Loader(dashboardContainer);

                TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
                    dashboard: 'Overview'
                });

				expect(dashboardContainer.html()).to.be(expectedHtml);
			});

			it('hides loading screen once html is set', function() {
				var loadingHidden = false;

				LOADING.hide = function() {
					loadingHidden = true;
				};

				new TLRGRP.BADGER.Dashboard.Loader($('#dashboard-container'));

                TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
                    dashboard: 'Overview'
                });

				expect(loadingHidden).to.be(true);
			});
		});
	});
})();