(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.ComponentModules');

    TLRGRP.BADGER.Dashboard.ComponentModules.ComponentLayout = function (configuration) {
        var componentElement = $(Mustache.render('<div class="{{componentClass}}"><h3>{{title}}</h3></div>', configuration));

        _(configuration.modules).forEach(function (module) {
            module.appendTo(componentElement);
        });

        return {
            appendTo: function (container) {
                componentElement.appendTo(container);
            }
        };
    };
})();