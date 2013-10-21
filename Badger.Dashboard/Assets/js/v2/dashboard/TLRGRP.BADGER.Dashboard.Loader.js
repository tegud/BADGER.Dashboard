(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.Dashboard.Loader = function(dashboardContainer) {
        LOADING.show();

        TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(dashboardAndView) {
            var dashboard = TLRGRP.BADGER.Dashboard.getById(dashboardAndView.dashboard);
            var view = dashboard.views[dashboardAndView.id];

            LOADING.show();

            var componentHtml = _(view.components).map(function(component) {
                return component.render();
            }).join('');

            dashboardContainer.html(componentHtml);

            LOADING.hide();
        });
    };
})();