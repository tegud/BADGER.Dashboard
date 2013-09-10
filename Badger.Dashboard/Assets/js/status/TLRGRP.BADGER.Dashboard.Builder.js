TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

(function () {
    var components = {
        'chart': function (item) {
            return $('<div />', {
                'class': 'graph-container' + (item.class ? ' ' + item.class : '')
            })
                .append($('<div />', {
                    'class': 'graph-title',
                    text: item.title
                }))
                .append($('<iframe />', {
                    src: 'assets/graph.html?expressions=' + encodeURIComponent(JSON.stringify(item.expressions))
                        + '&chartOptions=' + encodeURIComponent(JSON.stringify(item.chartOptions)),
                    frameborder: '0'
                }));
        }
    };

    TLRGRP.BADGER.Dashboard.Builder = function (element, config) {
        _(config).each(function (item) {
            var component = item.component || 'chart';
            var componentBuilder = components[component];

            if (!componentBuilder) {
                return true;
            }

            element.append(componentBuilder(item));
        });
	};
})();