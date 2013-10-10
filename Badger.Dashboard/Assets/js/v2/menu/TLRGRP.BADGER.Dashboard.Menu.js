(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    (function() {
        TLRGRP.BADGER.Dashboard.Register({ id: 'Overview' });
        TLRGRP.BADGER.Dashboard.Register({ id: 'Mobile' });
        TLRGRP.BADGER.Dashboard.Register({ id: 'Requests' });
        TLRGRP.BADGER.Dashboard.Register({ id: 'Performance' });
        TLRGRP.BADGER.Dashboard.Register({ id: 'Disk' });
        TLRGRP.BADGER.Dashboard.Register({ 
                id: 'ByServer', 
                name: 'By Server' 
            });
        TLRGRP.BADGER.Dashboard.Register({ 
                id: 'ByPage', 
                name: 'By Page' 
            });
    })();

    function buildViewModel(dashboards, initialDashboard) {
        return {
            currentDashboard: initialDashboard,
            dashboards: _(dashboards).map(function(dashboard){
                if(!dashboard.name) {
                    dashboard.name = dashboard.id;
                }

                return dashboard;
            })
        };
    }

    var menuTemplate = '<li class="top-level-item"><div class="current-item">{{currentDashboard}}</div><select class="submenu-options available-dashboards">{{#dashboards}}<option value="{{id}}">{{name}}</option>{{/dashboards}}</select></li>';

    TLRGRP.BADGER.Dashboard.Menu = function(menuElement) {
        var dashboards = TLRGRP.BADGER.Dashboard.getAll();

        var ul = $('ul', menuElement);
        var menuHtml =  Mustache.render(menuTemplate, 
                        buildViewModel(dashboards, 'Overview'));

        $(menuHtml)
            .appendTo(ul)
            .on('change', '.available-dashboards', function() {
                var selectedOption = $('option:selected', this);

                TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
                    id: selectedOption[0].value
                });
            });

        TLRGRP.messageBus.subscribe('TLRGRP.BADGER.Dashboard.Selected', function(newDashboardInfo) {
            var dashboardName = TLRGRP.BADGER.Dashboard.getById(newDashboardInfo.id).name;

            $('.top-level-item:eq(1) .current-item').text(dashboardName);
        });
    };
})();