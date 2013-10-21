(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.Dashboard.Loader = function(dashboardContainer) {
        LOADING.show();

        TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(dashboardAndView) {
            var dashboard = TLRGRP.BADGER.Dashboard.getById(dashboardAndView.dashboard);
            var view = dashboard.views[dashboardAndView.id];

            LOADING.show();

            dashboardContainer.empty();

            var components = _(view.components).forEach(function(component) {
                return component.render(dashboardContainer);
            });

            dashboardContainer.addClass('initialised');

            LOADING.hide();
        });
    };
})();