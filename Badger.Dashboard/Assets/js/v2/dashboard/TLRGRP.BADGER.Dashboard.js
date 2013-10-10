(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    (function() {
        TLRGRP.BADGER.Dashboard.Dashboard = function(options) {
            var name = options.name || options.id;

            return {
                id: options.id,
                name: name
            };
        };

        var dashboards = {};

        TLRGRP.BADGER.Dashboard.Register = function(dashboard) {
            dashboards[dashboard.id] = new TLRGRP.BADGER.Dashboard.Dashboard(dashboard);
        };

        TLRGRP.BADGER.Dashboard.getAll = function() {
            return _(dashboards).map(function(item) {
                return item;
            });
        };

        TLRGRP.BADGER.Dashboard.getById = function(id) {
            return dashboards[id];
        };
    })();
})();