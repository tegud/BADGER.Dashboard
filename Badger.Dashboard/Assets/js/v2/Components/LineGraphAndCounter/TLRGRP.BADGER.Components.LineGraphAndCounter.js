(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Components');

    TLRGRP.BADGER.Dashboard.Components.LineGraphAndCounter = function (configuration) {
        var componentElement = $('<div class="v2-graph-counter">Errors in last 10mins<strong class="v2-graph-counter-value">60</strong></div><div class="v2-graph-container"></div>');

        var inlineLoading = new TLRGRP.BADGER.Dashboard.ComponentModules.InlineLoading();

        var componentLayout = new TLRGRP.BADGER.Dashboard.ComponentModules.ComponentLayout({
            title: configuration.title,
            componentClass: 'graph-and-counter-component',
            modules: [
                inlineLoading,
                {
                    appendTo: function (containerElement) {
                        componentElement.appendTo(containerElement);
                    },
                    appendToLocation: function () {
                        return 'content';
                    }
                }]
        });

        var stateMachine = nano.Machine({
            states: {
                uninitialised: {
                    initialise: function (container) {
                        inlineLoading.loading();
                        componentLayout.appendTo(container);
                    }
                },
                initialised: {
                    _onEnter: function() {
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

