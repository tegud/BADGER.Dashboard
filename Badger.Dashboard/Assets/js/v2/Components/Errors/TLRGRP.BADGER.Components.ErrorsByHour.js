(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Components');

    TLRGRP.BADGER.Dashboard.Components.ErrorsByHour = function (configuration) {
        var componentLayout = new TLRGRP.BADGER.Dashboard.ComponentModules.ComponentLayout({
            title: 'By Hour',
            componentClass: 'errors-by-hour-selector',
            modules: [
                {
                    appendTo: function (componentElement) {
                        var hours = [];

                        function padHour(hour) {
                            if (hour < 10) {
                                return '0' + hour;
                            }
                            return hour;
                        }

                        for (var x = 0; x < 24; x++) {
                            var start = padHour(x) + ':00';
                            var end = x == 23 ? '23:59' : padHour(x + 1) + ':00';

                            hours.push({
                                start: start,
                                end: end
                            });
                        }

                        componentElement.append(Mustache.render('<ul class="errors-by-hour-list">{{#hours}}<li><a href=""><div class="errors-by-hour-link">{{start}} - {{end}}</div><div class="errors-by-hour-counter">9999</div><div class="errors-by-hour-graph"></div></a></li>{{/hours}}</ul>', {
                            hours: hours
                        }));
                    }
                }
            ]
        });
        
        var stateMachine = nano.Machine({
            states: {
                uninitialised: {
                    initialise: function (container) {
                        componentLayout.appendTo(container);
                        this.transitionToState('initialised');
                    }
                },
                initialised: {
                    _onEnter: function () {
                    }
                }
            },
            initialState: 'uninitialised'
        });

        return {
            render: function (container) {
                return stateMachine.handle('initialise', container);
            },
            unload: function () {
                stateMachine.handle('stop');
                stateMachine.handle('remove');
            }
        };
    };
})();

