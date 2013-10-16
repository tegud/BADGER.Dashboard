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
            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.Dashboard.Selected', function(newDashboardInfo) {
                currentDashboard = newDashboardInfo.id;
                var selectedDashboard = TLRGRP.BADGER.Dashboard.getById(currentDashboard);
                var dashboardName = selectedDashboard.name;

                if($.isEmptyObject(selectedDashboard.views)) {
                    TLRGRP.BADGER.URL.pushState({ 
                        url: buildUrl(selectedDashboard.id),
                        dashboard: selectedDashboard.id
                    });
                }
                else {
                    var defaultView = _(selectedDashboard.views).map(function(view) {
                        if(view.isDefault) {
                            return view;
                        }
                    })[0];

                    TLRGRP.messageBus.publish('TLRGRP.BADGER.View.Selected', {
                        id: defaultView.id
                    });
                }
            });

            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(newViewInfo) {
                var selectedDashboard = TLRGRP.BADGER.Dashboard.getById(currentDashboard);
                var dashboardName = selectedDashboard.name;

                TLRGRP.BADGER.URL.pushState({ 
                    url: buildUrl(selectedDashboard.id, newViewInfo.id),
                    dashboard: currentDashboard,
                    view: newViewInfo.id
                });
            });

            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.PAGE.HistoryPopState', function(state) {
                TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
                    id: state.dashboard
                });

                if(state.view){ 
                    TLRGRP.messageBus.publish('TLRGRP.BADGER.View.Selected', {
                        id: state.view
                    });
                }
            });
        }

        subscribeToMessageBusEvents();

        TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
            id: currentDashboard
        });
    };
})();