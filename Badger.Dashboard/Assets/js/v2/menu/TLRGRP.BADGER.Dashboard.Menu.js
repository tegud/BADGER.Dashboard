(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    function buildViewModel(dashboards, initialDashboard) {
        var currentDashboard = TLRGRP.BADGER.Dashboard.getById(initialDashboard);
        currentDashboard.views = _(currentDashboard.views).map(function(view) {
            return view;
        });

        var viewModel = {
            currentDashboard: currentDashboard,
            currentView: 'Summary',
            dashboards: _(dashboards).map(function(dashboard){
                dashboard = _.extend({}, dashboard);

                if(!dashboard.name) {
                    dashboard.name = dashboard.id;
                }

                dashboard.views = _(dashboard.views).map(function(view) {
                    return view;
                });

                return dashboard;
            })
        };

        return viewModel;
    }

    var menuTemplate = '<li class="top-level-item"><div class="current-item">{{currentDashboard.name}}</div><select class="submenu-options available-dashboards">{{#dashboards}}<option value="{{id}}">{{name}}</option>{{/dashboards}}</select></li><li class="top-level-item"><div class="current-item">Summary</div><select class="submenu-options available-views">{{#currentDashboard.views}}<option>{{name}}</option>{{/currentDashboard.views}}</select></li>';

    TLRGRP.BADGER.Dashboard.Menu = function(menuElement) {
        var dashboards = TLRGRP.BADGER.Dashboard.getAll();

        var ul = $('ul', menuElement);
        var currentDashboard = 'Overview';
        var menuHtml =  Mustache.render(menuTemplate, 
                        buildViewModel(dashboards, currentDashboard));
        var dashboardSelectorElement;
        var viewSelectorElement;

        function setUpMenuHtml() {
            $(menuHtml).appendTo(ul);

            dashboardSelectorElement = $('.top-level-item:eq(1)', menuElement);
            viewSelectorElement = $('.top-level-item:eq(2)', menuElement);
        }

        function attachMenuDomEvents() {
            menuElement
                .on('change', '.available-dashboards', function() {
                    var selectedOption = $('option:selected', this);

                    TLRGRP.messageBus.publish('TLRGRP.BADGER.Dashboard.Selected', {
                        id: selectedOption[0].value
                    });
                })
                .on('change', '.available-views', function() {
                    var selectedOption = $('option:selected', this);

                    TLRGRP.messageBus.publish('TLRGRP.BADGER.View.Selected', {
                        id: selectedOption[0].value
                    });  
                });
        }

        function subscribeToMessageBusEvents() {
            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.Dashboard.Selected', function(newDashboardInfo) {
                currentDashboard = newDashboardInfo.id;
                var selectedDashboard = TLRGRP.BADGER.Dashboard.getById(currentDashboard);
                var dashboardName = selectedDashboard.name;

                if($.isEmptyObject(selectedDashboard.views)) {
                    viewSelectorElement.addClass('hidden');
                }
                else {
                    viewSelectorElement.removeClass('hidden');
                }

                $('.current-item', dashboardSelectorElement).text(dashboardName);
            });

            TLRGRP.messageBus.subscribe('TLRGRP.BADGER.View.Selected', function(newViewInfo) {
                var currentDashboardObject = TLRGRP.BADGER.Dashboard.getById(currentDashboard);
                var viewName;
                if(!currentDashboardObject.views[newViewInfo.id]) {
                    return;
                }

                viewName = currentDashboardObject.views[newViewInfo.id].name;

                $('.current-item', viewSelectorElement).text(viewName);
            });
        }

        setUpMenuHtml();
        attachMenuDomEvents();
        subscribeToMessageBusEvents();
    };
})();