(function () {
    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    var colors = new TLRGRP.BADGER.ColorPalette();

    TLRGRP.BADGER.Dashboard.Overview = function () {
        var subMetrics = {
            'Summary': [
                {
                    id: 'TrafficByType',
                    'class': 'half',
                    source: 'IIS',
                    title: 'Traffic by Type',
                    expressions: ['AllTraffic', 'BotTraffic', 'MobileTraffic'],
                    chartOptions: {
                        dimensions: {
                            margin: { left: 50 }
                        }
                    }
                },
                {
                    id: 'AllErrors',
                    'class': 'half',
                    source: 'Errors',
                    title: 'Errors',
                    expressions: ['AllErrors'],
                    chartOptions: {
                        legend: false,
                        yAxisLabel: '',
                        dimensions: {
                            margin: { right: 20 }
                        }
                    }
                },
                {
                    id: 'ResponseTimeByPage',
                    'class': 'half',
                    source: 'IIS',
                    title: 'Response Time by Page',
                    expressions: [
                        'HomePageServerResponseTime',
                        'SearchServerResponseTime',
                        'HotelDetailsServerResponseTime',
                        'BookingFormServerResponseTime'
                    ],
                    chartOptions: {
                        dimensions: {
                            margin: { left: 50 }
                        }
                    }
                },
                {
                    id: 'StatusCodes',
                    'class': 'half',
                    source: 'IIS',
                    title: 'Status Codes (500/404)',
                    expressions: [{
                            id: 'NotFoundResponse',
                            color: colors.getColorByIndex(2)
                        },
                        'ErrorResponse'],
                    chartOptions: {
                        dimensions: {
                            margin: {
                                left: 50,
                                right: 100
                            }
                        }
                    }
                }
            ],
            'Traffic': [
                {
                    id: 'TrafficByPage',
                    source: 'IIS',
                    title: 'Traffic by Page',
                    expressions: ['HomePageRequests', 'SearchRequests', 'HotelDetailsRequests', 'BookingFormRequests'],
                    chartOptions: {
                        dimensions: {
                            margin: {
                                left: 50
                            }
                        }
                    }
                },
                {
                    id: 'TrafficByType',
                    'class': 'half',
                    source: 'IIS',
                    title: 'Traffic by Type',
                    expressions: ['AllTraffic', 'BotTraffic', 'MobileTraffic'],
                    chartOptions: {
                        dimensions: {
                            margin: { left: 50 }
                        }
                    }
                },
                {
                    id: 'TrafficByChannel',
                    'class': 'half',
                    source: 'IIS',
                    title: 'Traffic by Channel',
                    expressions: ['ChannelDirectRequests', 'ChannelMobileRequests', 'ChannelAffiliateRequests'],
                    chartOptions: {
                        dimensions: {
                            margin: {
                                left: 50,
                                right: 100
                            }
                        }
                    }
                }
            ],
            'Errors': [{
                    id: 'AllErrors',
                    source: 'Errors',
                    title: 'Errors',
                    expressions: ['AllErrors'],
                    chartOptions: {
                        legend: false,
                        yAxisLabel: '',
                        dimensions: {
                            margin: { right: 20 }
                        }
                    }
                },
                {
                    id: 'UserJourneyErrors',
                    'class': 'half',
                    source: 'Errors',
                    title: 'User Journey (pre-booking form) Errors',
                    expressions: ['SearchErrors', 'HotelDetailsErrors']
                },
                {
                    id: 'BookingErrors',
                    'class': 'half',
                    source: 'Errors',
                    title: 'Booking Errors',
                    expressions: [{ id: 'BookingErrors', color: colors.getColorByIndex(0) }],
                    chartOptions: {
                        legend: false,
                        dimensions: {
                            margin: { right: 20 }
                        }
                    }
                }],
            'IPG': [
                {
                    id: 'IPGErrors',
                    source: 'Errors',
                    title: 'IPG Booking',
                    expressions: [
                        { id: 'IPGRequestTimeoutErrors', color: colors.getColorByIndex(0) },
                        { id: 'IPGSessionTimeoutErrors', color: colors.getColorByIndex(2) },
                        { id: 'IPGInvalidSessionErrors', color: colors.getColorByIndex(4) }
                    ],
                    chartOptions: {
                        dimensions: {
                            margin: { right: 110 }
                        }
                    }
                },
                {
                    id: 'IPGResponseTime',
                    source: 'IIS',
                    title: 'Average Time for Tokenisation',
                    expressions: ['IPGResponseTime'],
                    chartOptions: {
                        legend: false
                    }
                }
            ]
        };

        return new TLRGRP.BADGER.Dashboard.GraphSet({
            metric: 'Overview',
            subMetrics: subMetrics
        });
    };
})();