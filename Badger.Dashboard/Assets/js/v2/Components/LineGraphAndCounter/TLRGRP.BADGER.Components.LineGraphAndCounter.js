(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Components');
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.ComponentMoudles');

    TLRGRP.BADGER.Dashboard.ComponentMoudles.Counter = function () {
        var element = $('<div class="v2-graph-counter">Errors in last 10mins</div>');
        var counterValueElement = $('<strong class="v2-graph-counter-value">-</strong>').appendTo(element);

        return {
            appendTo: function (container) {
                container.append(element);
            },
            appendToLocation: function () {
                return 'content';
            },
            setValue: function (value) {
                counterValueElement.text(value);
            }
        };
    };

    TLRGRP.BADGER.Dashboard.ComponentMoudles.LineGraph = function () {
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

    TLRGRP.BADGER.Dashboard.Components.LineGraphAndCounter = function (configuration) {
        var inlineLoading = new TLRGRP.BADGER.Dashboard.ComponentModules.InlineLoading();
        
        var counter = new TLRGRP.BADGER.Dashboard.ComponentMoudles.Counter();
        var lineGraph = TLRGRP.BADGER.Dashboard.ComponentMoudles.LineGraph();

        var componentLayout = new TLRGRP.BADGER.Dashboard.ComponentModules.ComponentLayout({
            title: configuration.title,
            componentClass: 'graph-and-counter-component',
            modules: [
                inlineLoading,
                counter,
                lineGraph
            ]
        });
        
        var dataStore = new TLRGRP.BADGER.Dashboard.DataStores.AjaxDataStore({
            url: 'http://10.44.22.158:1081/1.0/metric?expression=sum(lr_errors)&step=6e4&limit=60',
            refresh: 5000,
            callbacks: {
                success: function (data) {
                    var sum = _(data.reverse()).first(10).reduce(function (total, item) {
                        return total + item.value;
                    }, 0);

                    counter.setValue(sum);
                }
            },
            components: {
                loading: inlineLoading
            }
        });

        var stateMachine = nano.Machine({
            states: {
                uninitialised: {
                    initialise: function (container) {
                        inlineLoading.loading();
                        componentLayout.appendTo(container);
                        this.transitionToState('initialised');
                    }
                },
                initialised: {
                    _onEnter: function () {
                        dataStore.start(true);
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

