(function () {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard.DataStores');

    var defaultOptions = {
        pauseWhenNotVisible: true,
        refresh: 10000
    };

    TLRGRP.BADGER.Dashboard.DataStores.AjaxDataStore = function (options) {
        var currentOptions = $.extend(true, {}, defaultOptions, options);
        var currentTimeout;
        var stateMachine = nano.Machine({
            states: {
                stopped: {
                    _onEnter: function () {
                        clearTimeout();
                    },
                    start: function (doItNow) {
                        if (doItNow) {
                            this.transitionToState('refreshing');
                            return;
                        }
                        this.transitionToState('waiting');
                    },
                    refreshComplete: function (data) {
                        executeSuccessCallbackIfSpecified(data);
                    },
                    refreshFailed: function (errorInfo) {
                        executeErrorCallbackIfSpecified(errorInfo);
                    }
                },
                waiting: {
                    _onEnter: function () {
                        var stateMachineApi = this;

                        currentTimeout = setTimeout(function () {
                            stateMachineApi.transitionToState('refreshing');
                        }, currentOptions.refresh);
                    },
                    start: function (doItNow) {
                        var stateMachineApi = this;

                        if (doItNow) {
                            clearTimeout(currentTimeout);
                            this.transitionToState('refreshing');
                            return;
                        }

                        currentTimeout = setTimeout(function () {
                            stateMachineApi.transitionToState('refreshing');
                        }, currentOptions.refresh);
                    },
                    stop: function () {
                        this.transitionToState('stopped');
                    }
                },
                refreshing: {
                    _onEnter: function () {
                        if (currentOptions.components.loading) {
                            currentOptions.components.loading.loading();
                        }

                        $.ajax({
                            url: currentOptions.url,
                            success: function (data) {
                                stateMachine.handle('refreshComplete', data);
                            },
                            error: function (errorInfo) {
                                stateMachine.handle('refreshFailed', errorInfo);
                            }
                        });
                    },
                    refreshComplete: function (data) {
                        executeSuccessCallbackIfSpecified(data);

                        if (currentOptions.components.loading) {
                            currentOptions.components.loading.finished();
                        }

                        this.transitionToState('waiting');
                    },
                    refreshFailed: function (errorInfo) {
                        executeErrorCallbackIfSpecified(errorInfo);

                        if (currentOptions.components.loading) {
                            currentOptions.components.loading.finished();
                        }

                        this.transitionToState('waiting');
                    },
                    stop: function () {
                        this.transitionToState('stopped');
                    }
                }
            },
            initialState: 'stopped'
        });

        function clearTimeout() {
            if (currentTimeout) {
                clearTimeout(currentTimeout);
            }
        }

        function executeSuccessCallbackIfSpecified(data) {
            if (currentOptions.callbacks.success && $.isFunction(currentOptions.callbacks.success)) {
                currentOptions.callbacks.success(data);
            }
            
            if (currentOptions.components.lastUpdated) {
                currentOptions.components.lastUpdated.setLastUpdated(data.refreshedAt);
            }
        }

        function executeErrorCallbackIfSpecified(errorInfo) {
            if (currentOptions.callbacks.error && $.isFunction(currentOptions.callbacks.error)) {
                currentOptions.callbacks.error(errorInfo);
            }

            if (currentOptions.components.lastUpdated) {
                currentOptions.components.lastUpdated.refreshText();
            }
        }

        function setNewRefresh(refreshIn) {
            currentOptions.refresh = refreshIn;
        }

        if (currentOptions.pauseWhenNotVisible) {
            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.PAGE.Hidden', function () {
                stateMachine.handle('stop');
            });

            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.PAGE.Visible', function () {
                stateMachine.handle('start');
            });
        }

        return {
            start: function (doItNow) {
                stateMachine.handle('start', doItNow);
            },
            stop: function () {
                stateMachine.handle('stop');
            },
            setNewRefresh: function (newRefresh) {
                setNewRefresh(newRefresh);
            }
        };
    };
})();
