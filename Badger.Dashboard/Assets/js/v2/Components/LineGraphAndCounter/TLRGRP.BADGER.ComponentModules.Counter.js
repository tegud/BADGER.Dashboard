(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.ComponentModules');

    TLRGRP.BADGER.Dashboard.ComponentModules.Counter = function (configuration) {
        var containerElement = $('<div class="v2-graph-counter' + (configuration.className ? ' ' + configuration.className : '') + '">' + configuration.title + '</div>');
        var indicatorElement = $('<div class="v2-graph-counter-indicator hidden"></div>').appendTo(containerElement);
        var counterValueElement = $('<strong class="v2-graph-counter-value">-</strong>').appendTo(containerElement);
        var lastValue;

        return {
            appendTo: function (container) {
                container.append(containerElement);
            },
            appendToLocation: function () {
                return 'content';
            },
            setValue: function (data) {
                var value = _(data.slice(0).reverse()).first(configuration.numberOfPreviousEntriesToSum || 10).reduce(function (total, item) {
                    return total + item.value;
                }, 0);

                if (configuration.precision === 0) {
                    value = Math.floor(value);
                }

                counterValueElement.text((configuration.prefix || '') + value);

                if (lastValue && lastValue !== value) {
                    indicatorElement.removeClass('hidden');
                    
                    if (value > lastValue) {
                        indicatorElement
                            .addClass(configuration.upClass || '')
                            .removeClass(configuration.downClass || '')
                            .removeClass('down');
                    } else {
                        indicatorElement
                            .removeClass(configuration.upClass || '')
                            .addClass(configuration.downClass || '')
                            .addClass('down');
                    }
                }

                lastValue = value;
            }
        };
    };
})();

