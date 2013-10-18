(function() {
    'use strict';

    var viewSelectorTemplate = '{{#views}}<option value="{{id}}">{{name}}</option>{{/views}}';

    TLRGRP.namespace('TLRGRP.BADGER.Dashboard');

    TLRGRP.BADGER.Dashboard.ViewSelector = function(selectorElement) {
        var viewSelect = $('select', selectorElement);
        var viewCurrentItem = $('.current-item', selectorElement);

        function buildViewModel(views) {
            return _(views).map(function(view) {
                return view;
            });
        }

        return {
            setViews: function(views) {
                var viewsViewModel = buildViewModel(views);

                if(!viewsViewModel.length) {
                    selectorElement.addClass('hidden');
                }
                else {
                    if(viewsViewModel.length === 1) {
                        selectorElement.addClass('text-only');
                    }
                    else {
                        selectorElement.removeClass('text-only');   
                    }

                    selectorElement.removeClass('hidden');

                    viewSelect.html(Mustache.render(viewSelectorTemplate, {
                        views: viewsViewModel
                    }));
                }
            },
            setValue: function(newValue) {
                viewCurrentItem.text(newValue.name);
                viewSelect.val(newValue.id);
            }
        };
    };
})();