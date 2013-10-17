(function() {
	'use strict';

	var currentUrl = '/V2';
	TLRGRP.BADGER.URL.current = function() {
		return currentUrl;
	};
	var originalUrl = TLRGRP.BADGER.URL;

	describe('Dashboard Page', function () {
		beforeEach(function() {
			TLRGRP.messageBus.setUpClearDown();

			TLRGRP.BADGER.Dashboard.clear();
			TLRGRP.BADGER.Dashboard.register({ 
				id: 'Overview',
				views: {
					Summary: {
						id: 'Summary',
						name: 'Summary'
					},
					Traffic: {
						id: 'Traffic',
						name: 'Traffic'
					}
				}
			});
			TLRGRP.BADGER.Dashboard.register({ id: 'Mobile' });
			TLRGRP.BADGER.Dashboard.register({ 
				id: 'Requests',
				views: {
					Executing: {
						id: 'Executing',
						name: 'Requests Executing'
					},
					PerSec: {
						id: 'PerSec',
						name: 'Requests /s'
					}
				} 
			});
			TLRGRP.BADGER.Dashboard.register({ id: 'Performance' });
			TLRGRP.BADGER.Dashboard.register({ id: 'Disk' });
			TLRGRP.BADGER.Dashboard.register({ 
				id: 'ByServer', 
				name: 'By Server' 
			});
			TLRGRP.BADGER.Dashboard.register({ 
				id: 'ByPage', 
				name: 'By Page' 
			});

			currentUrl = '/V2';
		});

		describe('url does not specify a dashboard or view', function() {
			it('the Overview dashboard is selected', function() {
				var expectedDashboard = 'Overview';
				var actualDashboard;

				TLRGRP.messageBus.subscribe('TLRGRP.BADGER.DashboardAndView.Selected', function(newDashboardInfo) {
					actualDashboard = newDashboardInfo.dashboard;
				});

				var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

				expect(actualDashboard).to.be(expectedDashboard);
			});
		});

		describe('default dashboard', function() {
			describe('is selected', function() {
				it('sets the url to default', function() {
					var expectedNewUrl = '/V2';
					var actualNewUrl;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.BADGER.URL.pushState = function(pageInfo) {
						actualNewUrl = pageInfo.url;
					};

					TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
						dashboard: 'Overview'
					});

					expect(actualNewUrl).to.be(expectedNewUrl);
				});
			});

			describe('a non default view is selected', function() {
				it('sets the url to dashboard/view', function() {
					var expectedNewUrl = '/V2/Overview/Traffic';
					var actualNewUrl;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.BADGER.URL.pushState = function(pageInfo) {
						actualNewUrl = pageInfo.url;
					};

					TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
						dashboard: 'Overview',
						view: 'Traffic'
					});

					expect(actualNewUrl).to.be(expectedNewUrl);
				});
			});

			describe('default view is selected', function() {
				it('sets the url to default', function() {
					var expectedNewUrl = '/V2';
					var actualNewUrl;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.BADGER.URL.pushState = function(pageInfo) {
						actualNewUrl = pageInfo.url;
					};

					TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
						dashboard: 'Overview',
						view: 'Summary'
					});

					expect(actualNewUrl).to.be(expectedNewUrl);
				});
			});
		});

		describe('dashboard is selected', function() {
			it('pushes dashboard to url state', function() {
				var expectedNewUrl = '/V2/ByPage';
				var actualNewUrl = '';
				var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

				TLRGRP.BADGER.URL.pushState = function(pageInfo) {
					actualNewUrl = pageInfo.url;
				};

				TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
					dashboard: 'ByPage'
				});

				expect(actualNewUrl).to.be(expectedNewUrl);
			});
		});

		describe('user navigates back or forwards to a previously viewed dashboard', function() {
			describe('with a default view', function() {
				it('loads the specified dashboard', function() {
					var expectedDashboard = 'Requests';
					var actualDashboard;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.messageBus.subscribe('TLRGRP.BADGER.Dashboard.Selected', function(newDashboardInfo) {
						actualDashboard = newDashboardInfo.id;				
					});

					TLRGRP.messageBus.publish('TLRGRP.BADGER.PAGE.HistoryPopState', {
						dashboard: 'Requests'
					});

					expect(actualDashboard).to.be(expectedDashboard);
				});

				it('loads the default view', function() {
					var expectedView = 'Executing';
					var actualView;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(newViewInfo) {
						actualView = newViewInfo.id;				
					});

					TLRGRP.messageBus.publish('TLRGRP.BADGER.PAGE.HistoryPopState', {
						dashboard: 'Requests'
					});

					expect(actualView).to.be(expectedView);
				});
			});

			describe('with a specified view', function() {
				it('loads the specified dashboard', function() {
					var expectedDashboard = 'Requests';
					var actualDashboard;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.messageBus.subscribe('TLRGRP.BADGER.Dashboard.Selected', function(newDashboardInfo) {
						actualDashboard = newDashboardInfo.id;				
					});

					TLRGRP.messageBus.publish('TLRGRP.BADGER.PAGE.HistoryPopState', {
						dashboard: 'Requests'
					});

					expect(actualDashboard).to.be(expectedDashboard);
				});

				it('loads the specified view', function() {
					var expectedView = 'PerSec';
					var actualView;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(newViewInfo) {
						actualView = newViewInfo.id;				
					});

					TLRGRP.messageBus.publish('TLRGRP.BADGER.PAGE.HistoryPopState', {
						dashboard: 'Requests',
						view: 'PerSec'
					});

					expect(actualView).to.be(expectedView);
				});

				it('doesn\'t load the default view then the specified view', function() {
					var defaultViewLoaded = false;
					var pageManager = new TLRGRP.BADGER.Dashboard.PageManager();

					TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(newViewInfo) {
							console.log(newViewInfo.id);
						if(newViewInfo.id === 'Executing') {
							defaultViewLoaded = true;
						}
					});

					TLRGRP.messageBus.publish('TLRGRP.BADGER.PAGE.HistoryPopState', {
						dashboard: 'Requests',
						view: 'PerSec'
					});

					expect(defaultViewLoaded).to.be(false);
				});
			});
		});
	});
})();