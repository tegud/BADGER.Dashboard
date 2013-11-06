(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Components');

    TLRGRP.BADGER.Dashboard.Components.HealthCheck = function (configuration) {
        var componentElement = $('<div class="health-check-component"></div>')
            .append($(Mustache.render('<h3>{{title}}</h3><div class="inline-loading-container"><div class="inline-loading hidden"></div></div><div class="health-check-last-updated">Last Updated: <span class="health-check-last-updated-time">No Update Received</span></div>', {
                title: configuration.title
            })));
        var loadingElement = $('.inline-loading', componentElement);
        var lastUpdated;
        var currentTimeout;
        var refreshServerBaseUrl = 'http://' + configuration.host + ':' + configuration.port + '/';

        function loadingCompleted() {
            loadingElement.addClass('hidden');
        }

        function hideError() {
            $('.health-check-error', componentElement).addClass('hidden');
        }

        function showError(message) {
            var serverGroupsContainer = $('.health-check-server-groups-container', componentElement);
            var errorContainer = $('.health-check-error', componentElement).removeClass('hidden');
            var errorTextContainer = $('.health-check-error-text-container', errorContainer);
            $('.health-check-error-text', errorTextContainer).text(message);

            errorTextContainer.css({
                left: (serverGroupsContainer.width() - errorTextContainer.width()) / 2,
                top: (serverGroupsContainer.height() - errorTextContainer.height()) / 2
            });
        }

        function updateLastUpdated() {
            var lastUpdatedElement = $('.health-check-last-updated-time');

            if (lastUpdated) {
                lastUpdatedElement.text(lastUpdated.fromNow());
            }
        }
        
        function calculateNextRefresh(nextServerSideRefresh) {
            var adjustedNextServerSideRefresh = moment(nextServerSideRefresh).add(500, 'ms');
            var refreshIn = moment(adjustedNextServerSideRefresh).diff(moment());
            var minRefreshInterval = 1000;

            if (refreshIn < minRefreshInterval) {
                refreshIn = minRefreshInterval;
            }

            return refreshIn;
        }
        
        function error(errorMessage) {
            showError(errorMessage);
            loadingCompleted();
            updateLastUpdated();

            setNextTimeout(10000);
        }
        
        function updateServerGroups(groupData) {
            for (var group in groupData) {
                for (var server in groupData[group]) {
                    var serverId = server.replace(/\./g, '_').toLowerCase();
                    var serverStatusElement = document.getElementById(serverId);

                    serverStatusElement.className = 'health-check-group-server-item ' + groupData[group][server].toLowerCase();
                }
            }
        }

        function refresh() {
            loadingElement.removeClass('hidden');

            $.ajax({
                url: refreshServerBaseUrl + configuration.serverSet,
                success: function (data) {
                    updateServerGroups(data.groups);
                    
                    lastUpdated = moment(data.refreshedAt);

                    loadingCompleted();
                    hideError();
                    updateLastUpdated();
                    setNextTimeout(calculateNextRefresh(data.nextRefreshAt));
                },
                error: function (errorInfo) {
                    if (errorInfo && errorInfo.responseJSON && errorInfo.responseJSON.error) {
                        error(errorInfo.responseJSON.error);
                        return;
                    }

                    error('Cannot access health check server.');
                }
            });
        }
        
        function setNextTimeout(timeout) {
            currentTimeout = setTimeout(refresh, timeout);
        }
        
        function buildViewModel(groups) {
            return {
                groups: _(groups).map(function(group, groupName) {
                    return {
                        name: groupName,
                        servers: _(group.servers).map(function(server) {
                            server.id = server.host.replace(/\./ig, '_');

                            return server;
                        })
                    };
                })
            };
        }

        return {
            render: function (container) {
                container.append(componentElement);

                return $.ajax({
                    url: refreshServerBaseUrl + 'servers/' + configuration.serverSet,
                    success: function (groups) {
                        var viewModel = buildViewModel(groups);
                        
                        componentElement.append($(Mustache.render('<div class="health-check-server-groups-container"><div class="health-check-error hidden"><div class="health-check-error-text-container"><h3>Warning</h3><div class="health-check-error-text"></div></div></div><ul class="health-check-groups">{{#groups}}<li class="health-check-group-item"><h4>{{name}}</h4><ul class="health-check-group-server-list">{{#servers}}<li class="health-check-group-server-item" id="{{id}}">{{name}}</li>{{/servers}}</ul></li>{{/groups}}</ul></div>', viewModel)));
                        
                        refresh();
                    },
                    error: function (errorInfo) {
                        if (errorInfo && errorInfo.responseJSON && errorInfo.responseJSON.error) {
                            componentElement.append('<h4 class="health-check-comms-error">' + errorInfo.responseJSON.error + '</h4>');
                            return;
                        }
                        
                        componentElement.append('<h4 class="health-check-comms-error">Could not access Health Check Server</h4>');
                    }
                });
            },
            unload: function () {
                if (currentTimeout) {
                    clearTimeout(currentTimeout);
                }
            }
        };
    };
})();

