(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.ComponentModules');

    TLRGRP.BADGER.Dashboard.ComponentModules.LineGraph = function () {
        var element = $('<div class="v2-graph-container"></div>');

        return {
            appendTo: function (container) {
                container.append(element);
            },
            appendToLocation: function () {
                return 'content';
            }
        };
    };
})();

