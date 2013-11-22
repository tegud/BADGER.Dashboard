(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Components');

    TLRGRP.BADGER.Dashboard.Components.LineGraphAndCounter = function (configuration) {
        var inlineLoading = new TLRGRP.BADGER.Dashboard.ComponentModules.InlineLoading();
        
        var counter = new TLRGRP.BADGER.Dashboard.ComponentModules.Counter();
        var lineGraph = TLRGRP.BADGER.Dashboard.ComponentModules.LineGraph();

        var componentLayout = new TLRGRP.BADGER.Dashboard.ComponentModules.ComponentLayout({
            title: configuration.title,
            componentClass: 'graph-and-counter-component',
            modules: [
                inlineLoading,
                counter,
                lineGraph,
                {
                    appendTo: function (container) {
                        container.append($('<div class="error-graph-summary-text">Errors per one minute on LateRooms.com (WEB)</div>'));
                    }
                }
            ]
        });
        
        var dataStore = new TLRGRP.BADGER.Dashboard.DataStores.AjaxDataStore({
            url: 'http://10.44.22.158:1081/1.0/metric?expression=sum(lr_errors)&step=6e4&limit=60',
            refresh: 5000,
            callbacks: {
                success: function (data) {
                    var sum = _(data.slice(0).reverse()).first(10).reduce(function (total, item) {
                        return total + item.value;
                    }, 0);

                    counter.setValue(sum);
                    lineGraph.setData(data);
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

