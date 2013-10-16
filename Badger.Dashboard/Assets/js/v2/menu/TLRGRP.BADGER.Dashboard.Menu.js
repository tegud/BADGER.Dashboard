(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    function buildViewModel(dashboards) {
        var viewModel = {
            dashboards: _(dashboards).map(function(dashboard){
                dashboard = _.extend({}, dashboard);

                if(!dashboard.name) {
                    dashboard.name = dashboard.id;
                }

                return dashboard;
            })
        };

        return viewModel;
    }

    var menuTemplate = '<li class="top-level-item"><div class="current-item"></div><select class="submenu-options available-dashboards">{{#dashboards}}<option value="{{id}}">{{name}}</option>{{/dashboards}}</select></li><li class="top-level-item"><div class="current-item"></div><select class="submenu-options available-views"></select></li>';

    TLRGRP.BADGER.Dashboard.Menu = function(menuElement) {
        var dashboards = TLRGRP.BADGER.Dashboard.getAll();
        var dashboardSelectorElement;
        var viewSelectorElement;
        var currentDashboard;

        function setUpMenuHtml() {
            var ul = $('ul', menuElement);
            var menuHtml =  Mustache.render(menuTemplate, 
                            buildViewModel(dashboards));
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
                var viewSelect = $('select', viewSelectorElement);
                var viewsViewModel = _(selectedDashboard.views).map(function(view) {
                    return view;
                });

                if(!viewsViewModel.length) {
                    viewSelectorElement.addClass('hidden');
                }
                else {
                    viewSelectorElement.removeClass('hidden');

                    viewSelect.html(Mustache.render('{{#views}}<option value="{{id}}">{{name}}</option>{{/views}}', {
                        views: viewsViewModel
                    }));
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