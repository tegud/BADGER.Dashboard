(function () {
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Mobile');

    var colors = new TLRGRP.BADGER.ColorPalette();

    TLRGRP.BADGER.Dashboard.Mobile = function () {
        return new TLRGRP.BADGER.Dashboard.GraphSet({
            metric: 'Mobile',
            subMetrics: {
                'Summary': [
                    {
                        id: 'MobileTrafficSplit',
                        'class': 'half',
                        source: 'IIS',
                        title: 'Mobile Traffic',
                        graphType: 'stacked-area',
                        expressions: [{
                            id: 'MobileOnMobile',
                            color: colors.getColorByIndex(3),
                        }, 'MobileOnDesktop']
                    }, {
                        id: 'MobileTrafficByPage',
                        'class': 'half',
                        source: 'IIS',
                        title: 'Mobile Site traffic by Page',
                        graphType: 'stacked-area',
                        expressions: ['MobileHomePageRequests', 'MobileSearchRequests', 'MobileHotelDetailsRequests']
                    }, {
                        id: 'MobilePageResponseTime',
                        'class': 'half',
                        source: 'IIS',
                        title: 'Response Time by Page',
                        expressions: ['MobileHomePageServerResponseTime', 'MobileSearchServerResponseTime', 'MobileHotelDetailsServerResponseTime']
                    }, {
                        id: 'MobileTrafficOnDesktopByPage',
                        'class': 'half',
                        source: 'IIS',
                        title: 'Mobile traffic on Desktop by Page',
                        graphType: 'stacked-area',
                        expressions: ['MobileOnDesktopHomePageRequests', 'MobileOnDesktopSearchRequests', 'MobileOnDesktopHotelDetailsRequests']
                    }
                ]
            }
        });
    };
})();