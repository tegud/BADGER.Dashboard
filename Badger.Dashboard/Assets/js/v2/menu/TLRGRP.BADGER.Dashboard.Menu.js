(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');


    TLRGRP.BADGER.Dashboard.Menu = function(menuElement) {
        var ul = $('ul', menuElement);
        var menuHtml =  Mustache.render('<li class="top-level-item"><div class="current-item">{{currentDashboard}}</div><select class="submenu-options available-dashboards">{{#dashboards}}<option>{{name}}</option>{{/dashboards}}</select></li>', {
            currentDashboard: 'Overview',
            dashboards: [
                { name: 'Overview' },
                { name: 'Mobile' },
                { name: 'Requests' },
                { name: 'Performance' },
                { name: 'Disk' },
                { name: 'By Server' },
                { name: 'By Page' }
            ]
        });

        $(menuHtml)
            .appendTo(ul)
            .on('change', '.available-dashboards', function() {
                TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
                    id: 'ByPage'
                });
            });
    };
})();