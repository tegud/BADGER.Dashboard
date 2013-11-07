(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.Components');

    TLRGRP.BADGER.Dashboard.Components.HealthCheck = function (configuration) {
        var currentTimeout;
        var refreshServerBaseUrl = 'http://' + configuration.host + ':' + configuration.port + '/';
        var inlineLoading = new TLRGRP.BADGER.Dashboard.ComponentModules.InlineLoading();
        var lastUpdated = new TLRGRP.BADGER.Dashboard.ComponentModules.LastUpdated();
        var serverList = new TLRGRP.BADGER.Dashboard.ComponentModules.HealthCheckServerList();
        var componentLayout = new TLRGRP.BADGER.Dashboard.ComponentModules.ComponentLayout({
            title: configuration.title,
            componentClass: 'health-check-component',
            modules: [
                inlineLoading,
                lastUpdated,
                serverList
            ]
        });

        var stateMachine = nano.Machine({
            states: {
                uninitialised: {
                    initialise: function (container) {
                        componentLayout.appendTo(container);

                        return this.transitionToState('initialising');
                    }
                },
                initialising: {
                    _onEnter: function () {
                        return $.ajax({
                            url: refreshServerBaseUrl + 'servers/' + configuration.serverSet,
                            success: function (groups) {
                                stateMachine.handle('complete', groups);
                                stateMachine.handle('start');
                            },
                            error: function (errorInfo) {
                                stateMachine.handle('error', errorInfo);
                            }
                        });
                    },
                    complete: function (groups) {
                        serverList.setGroups(groups);
                        
                        this.transitionToState('paused');
                    }
                },
                failedToInitialise: {
                    _onEnter: function (errorInfo) {
                        if (errorInfo && errorInfo.responseJSON && errorInfo.responseJSON.error) {
                            componentLayout.setContent('<h4 class="health-check-comms-error">' + errorInfo.responseJSON.error + '</h4>');
                            return;
                        }

                        componentLayout.setContent('<h4 class="health-check-comms-error">Could not access Health Check Server</h4>');
                    }
                },
                paused: {
                    _onEnter: function() {
                        if (currentTimeout) {
                            clearTimeout(currentTimeout);
                        }
                    },
                    remove: function () {
                        this.transitionToState('uninitialised');
                    },
                    refreshComplete: function (data) {
                        success(data);
                    },
                    start: function() {
                        this.transitionToState('refreshing');
                    }
                },
                waiting: {
                    _onEnter: function (timeout) {
                        var internalMachine = this;

                        currentTimeout = setTimeout(function() {
                            internalMachine.transitionToState('refreshing');
                        }, timeout);
                    },
                    stop: function () {
                        this.transitionToState('paused');
                    }
                },
                refreshFailed: {
                    _onEnter: function (errorInfo) {
                        if (errorInfo && errorInfo.responseJSON && errorInfo.responseJSON.error) {
                            error(errorInfo.responseJSON.error);
                            return;
                        }

                        error('Cannot access health check server.');
                    },
                    stop: function() {
                        this.transitionToState('paused');
                    }
                },
                refreshing: {
                    _onEnter: function () {
                        var internalMachine = this;

                        inlineLoading.loading();
                        
                        $.ajax({
                            url: refreshServerBaseUrl + configuration.serverSet,
                            success: function (data) {
                                stateMachine.handle('refreshComplete', data);
                            },
                            error: function(errorInfo) {
                                internalMachine.transitionToState('refreshFailed', errorInfo);
                            }
                        });
                    },
                    refreshComplete: function (data) {
                        success(data);
                        
                        this.transitionToState('waiting', calculateNextRefresh(data.nextRefreshAt));
                    },
                    stop: function () {
                        this.transitionToState('paused');
                    }
                }
            },
            initialState: 'uninitialised'
        });

        function success(data) {
            serverList.updateStatus(data.groups);

            lastUpdated.setLastUpdated(data.refreshedAt);

            inlineLoading.finished();
            hideError();
        }

        function hideError() {
            //$('.health-check-error', componentElement).addClass('hidden');
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
            componentLayout.finishedLoading();
            lastUpdated.refreshText();

            //setNextTimeout(10000);
        }
        
        TLRGRP.messageBus.subscribe('TLRGRP.BADGER.PAGE.Hidden', function () {
            stateMachine.handle('stop');
        });

        TLRGRP.messageBus.subscribe('TLRGRP.BADGER.PAGE.Visible', function () {
            stateMachine.handle('start');
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

