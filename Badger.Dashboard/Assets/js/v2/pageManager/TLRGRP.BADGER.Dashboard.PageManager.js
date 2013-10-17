(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.URL = (function() {
        window.onpopstate = function(event) {
            if(!event.state) {
                return;
            }

            TLRGRP.messageBus.publish('TLRGRP.BADGER.PAGE.HistoryPopState', event.state);
        };

        return {
            current: function() {
                return window.location.pathname;
            },
            pushState: function(pageInfo) {
                if(pageInfo.url !== window.location.pathname) {
                    window.history.pushState(pageInfo, "Live Status", pageInfo.url);
                }
            }
        };
    })();

    TLRGRP.BADGER.Dashboard.PageManager = function() {
        var dashboards = TLRGRP.BADGER.Dashboard.getAll();
        var defaultDashboard = 'Overview';
        var currentDashboard = getDashboardFromUrl();

        function getDashboardFromUrl() {
            var currentUrl = TLRGRP.BADGER.URL.current();
            var splitUrl = currentUrl.split('/');

            if(splitUrl.length > 2) {
                return splitUrl[2];
            }

            return defaultDashboard;
        }

        function buildUrl(dashboardId, viewId) {
            var url = '/V2';
            var dashboard = TLRGRP.BADGER.Dashboard.getById(dashboardId);

            if(viewId && !dashboard.views[viewId].isDefault) {
                return url + '/' + dashboardId + '/' + viewId;
            }

            if(dashboardId === defaultDashboard) {
                return url;
            }

            return url + '/' + dashboardId;
        }

        function subscribeToMessageBusEvents() {
            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.DashboardAndView.Selected', function(dashboardAndView) {
                var dashboard = dashboardAndView.dashboard;
                var view = dashboardAndView.view;
                var selectedDashboard = TLRGRP.BADGER.Dashboard.getById(dashboard);

                currentDashboard = dashboard;

                if(!view) {
                    view = _(selectedDashboard.views).map(function(view) {
                        if(view.isDefault) {
                            return view.id;
                        }
                    })[0];
                }

                TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
                    id: dashboard
                });

                TLRGRP.messageBus.publish('TLRGRP.BADGER.View.Selected', {
                    id: view
                });

                TLRGRP.BADGER.URL.pushState({ 
                    url: buildUrl(dashboard, view),
                    dashboard: dashboard,
                    view: view
                });
            });

            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.PAGE.HistoryPopState', function(state) {
                TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
                    dashboard: state.dashboard,
                    view: state.view
                });
            });
        }

        subscribeToMessageBusEvents();

        TLRGRP.messageBus.publish('TLRGRP.BADGER.DashboardAndView.Selected', {
            dashboard: currentDashboard
        });
    };
})();