angular.module('mwUI', [
  'ngSanitize',
  'mwModal',
  'mwWizard',
  'mwListable',
  'mwListableBb',
  'mwForm',
  'mwFormBb',
  'mwComponents',
  'mwComponentsBb',
  'mwTabs',
  'mwSidebar',
  'mwSidebarBb',
  'mwFormValidators',
  'mwNav',
  'mwPopover',
  'mwHelper',
  'mwMap',
  'mwI18n',
  'mwResponseHandler',
  'mwResponseToastHandler',
  'mwFilters'
]).config(function(){
  'use strict';
  window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  window.ieVersion = (function () {
    if (new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(navigator.userAgent) !== null) {
      return parseFloat(RegExp.$1);
    } else {
      return false;
    }
  })();
});
'use strict';

angular.module('mwFilters', [])

.filter('humanize', function () {
  return function (input) {
    return input ? 'common.yes' : 'common.no';
  };
})

.filter('neverIfZero', ['i18n', function (i18n) {
  var filterFn =  function (input) {
    return input === 0 ? i18n.get('common.never') : input;
  };
  filterFn.$stateful = true;
  return filterFn;
}])

.filter('dashIfBlank', function () {
  return function (input) {
    return input ? input : '-';
  };
})

.filter('starIfBlank', function () {
  return function (input) {
    return input ? input : '*';
  };
})

.filter('join', function () {
  return function (input, opts) {

    if(!angular.isArray(input)){
      return input;
    }
    if(opts.lastSeparator){
      var els = _.clone(input),
      lastEl = els.pop();
      return els.join(opts.separator)+' '+opts.lastSeparator+' '+lastEl;
    } else {
      return input.join(opts.separator);
    }

  };
})

.filter('zeroIfEmpty', function () {
  return function (input) {
    return input ? input : 0;
  };
})

.filter('readableFilesize', function () {
  return function (fileSizeInBytes, startUnit) {
    if (fileSizeInBytes === 0) {
      return '0.0 kB';
    }
    var i = -1,
    byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if(startUnit !== undefined) {
      i = byteUnits.indexOf(startUnit);
    }
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
  };
})

.filter('reduceStringTo', function () {
  return function (input, count) {
    if(count && input && input.length > count) {
      return input.substr(0, count) + '...';
    }
    return input;
  };
});

'use strict';

angular.module('mwComponents', [])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwPanel
 * @element div
 * @description
 *
 * Wrapper directive for {@link http://getbootstrap.com/components/#panels Bootstraps Panel}.
 *
 * @param {string} mwPanel Panel title
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-panel>
 *      Panel content
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwPanel', function () {
    return {
      restrict: 'A',
      transclude: true,
      templateUrl: 'uikit/templates/mwComponents/mwPanel.html',
    };
  })


  .directive('mwContentHeader', function () {
    return {
      transclude: true,
      template: '<div class="mw-content-header" ng-transclude></div>'
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwSortIndicator
 * @element span
 * @description
 *
 * Displays a sort indicator. Arrow up when sort is active and not reversed arrow down vise versa.
 *
 * @param {boolean} isActive display an arrow up or down when true otherwise an up and down arrow
 * @param {boolean} isReversed display an arrow up or down
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-sort-indicator is-active="true" is-reversed="false"></div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwSortIndicator', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        isActive: '=',
        isReversed: '='
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwComponents/mwSortIndicator.html'
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwAlert
 * @element div
 * @description
 *
 * Wrapper directive for {@link http://getbootstrap.com/components/#alerts Bootstraps Alert}.
 *
 * @param {string} mwAlert Alert type. Can be one of the following:
 *
 * - warning
 * - danger
 * - success
 * - info
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-alert="warning">
 *      Alert content
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwAlert', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        type: '@mwAlert'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwComponents/mwAlert.html'
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwHeader
 * @element div
 * @description
 *
 * Header bar for content pages.
 *
 * @param {string} title Header title
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-header title="A nice page">
 *      Header content, Buttons etc...
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwHeader', ['$location', '$route', '$rootScope', function ($location, $route, $rootScope) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@',
        mwTitleIcon: '@',
        showBackButton: '=',
        warningText: '@',
        warningCondition: '=',
        mwBreadCrumbs: '='
      },
      templateUrl: 'uikit/templates/mwComponents/mwHeader.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        $rootScope.siteTitleDetails = scope.title;

        $transclude(function (clone) {
          if ((!clone || clone.length === 0) && !scope.showBackButton) {
            el.find('.navbar-header').addClass('no-buttons');
          }
        });

        scope.refresh = function () {
          $route.reload();
        };

        if (!scope.url && scope.mwBreadCrumbs && scope.mwBreadCrumbs.length > 0) {
          scope.url = scope.mwBreadCrumbs[scope.mwBreadCrumbs.length - 1].url;
          scope.url = scope.url.replace('#', '');
        } else if (!scope.url && scope.showBackButton) {
          console.error('Url attribute in header is missing!!');
        }

        scope.back = function () {
          $location.path(scope.url);
        };

      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwIcon
 * @element span
 * @description
 *
 * Wrapper for bootstrap glyphicons.
 *
 * @param {string} mwIcon Glyphicon class suffix. Example suffix for 'glyphicon glyphicon-search' is 'search'
 * @param {string} tooltip Optional string which will be displayed as a tooltip when hovering over the icon
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-icon="search"></span>
 *    <span mw-icon="search" tooltip="This is a tooltip"></span>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwIcon', function () {
    return {
      restrict: 'A',
      scope: {
        mwIcon: '@',
        tooltip: '@',
        placement: '@',
        style: '@'
      },
      template: '<i ng-class="iconClasses" style="{{style}}" mw-tooltip="{{tooltip}}" placement="{{placement}}"></i>',
      link: function (scope, el) {

        el.addClass('mw-icon');
        //set icon classes
        scope.$watch('mwIcon', function (newVal) {
          if (newVal) {
            var isFontAwesome = angular.isArray(scope.mwIcon.match(/^fa-/)),
              isRlnIcon = angular.isArray(scope.mwIcon.match(/rln-icon/));
            if (isFontAwesome) {
              scope.iconClasses = 'fa ' + scope.mwIcon;
            } else if (isRlnIcon) {
              scope.iconClasses = 'rln-icon ' + scope.mwIcon;
            } else {
              scope.iconClasses = 'glyphicon glyphicon-' + scope.mwIcon;
            }
          }
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name Relution.Common.directive:rlnTooltip
 * @element span
 *
 * @description
 * Creates a tooltip element using Bootstraps popover component.
 *
 * @param {String} mwTooltip Content of the tooltip
 *
 * @example
 <span mw-tooltip="foobar"></span>
 */
  .directive('mwTooltip', function () {
    return {
      restrict: 'A',
      scope: {
        text: '@mwTooltip',
        placement: '@'
      },
      link: function (scope, el) {
        scope.$watch('text', function () {
          el.data('bs.popover').setContent();
        });

        el.popover({
          trigger: 'hover',
          placement: scope.placement || 'bottom',
          content: function(){
            return scope.text;
          },
          container: 'body'
        });

        var destroyPopOver = function(){
          var popover = el.data('bs.popover');
          if (popover && popover.tip()) {
            popover.tip().detach().remove();
          }
        };

        scope.$on('$destroy', function () {
          destroyPopOver();
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwBadge
 * @element span
 * @description
 *
 * Wrapper for bootstrap labels.
 *
 * @param {string} mwBadge label class suffix. Example: suffix for 'label label-info' is 'search'
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-badge="info"></span>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwBadge', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {mwBadge: '@'},
      transclude: true,
      template: '<span class="mw-badge label label-{{mwBadge}}" ng-transclude></span>'
    };
  })

  .directive('mwEmptyState', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {mwBadge: '@'},
      transclude: true,
      template: '<div class="mw-empty-state"> <img src="images/logo-grey.png"><h2 ng-transclude class="lead"></h2> </div>'
    };
  })


/**
 * @ngdoc directive
 * @name mwComponents.directive:mwFilterableSearch
 * @element div
 * @description
 *
 * Creates a search field to filter by in the sidebar. Search is triggered on keypress 'enter'.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
  .directive('mwFilterableSearch', ['$timeout', '$animate', 'Loading', 'Detect', function ($timeout, $animate, Loading, Detect) {
    return {
      scope: {
        filterable: '=',
        mwDisabled: '=',
        property: '@'
//        loading: '='
      },
      templateUrl: 'uikit/templates/mwComponents/mwFilterableSearch.html',
      link: function (scope, elm) {
        $animate.enabled(false, elm.find('.search-indicator'));
        scope.model = scope.filterable.properties[scope.property];
        scope.inputLength = 0;
        scope.isMobile = Detect.isMobile();

        var timeout;

        var search = function () {
          return scope.filterable.applyFilters();
        };

        var throttler = function () {
          scope.searching = true;

          $timeout.cancel(timeout);

          timeout = $timeout(function () {

            search().then(function () {
              $timeout.cancel(timeout);
              scope.searching = false;
            }, function () {
              scope.searching = false;
            });

          }, 500);
        };

        scope.search = function (event) {

          if (!event || event.keyCode === 13) {
            search();
          } else {

            if (!scope.isMobile) {
              throttler();
            }
          }
        };

        scope.reset = function () {
          scope.model.value = '';
          search();
        };

//        Loading.registerDoneCallback(function(){
//          scope.loading = false;
//        });
//
//        scope.loading = Loading.isLoading();
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwRating
 * @element span
 * @description
 *
 * Converts a rating number into stars
 *
 * @param {number | expression} mwRating rating score
 * @param {number} max the maximun number of stars
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-rating="3"></span>
 *  </doc:source>
 * </doc:example>
 */
  .directive('mwRating', function () {
    return {
      restrict: 'A',
      scope: true,
      template: '<i ng-repeat="star in stars" ng-class="star.state" class="fa"></i>',
      link: function (scope, elm, attr) {

        elm.addClass('mw-star-rating');

        scope.stars = [];

        var buildStars = function () {
          scope.stars = [];

          var rating = scope.$eval(attr.mwRating) || 0;
          var starsMax = scope.$eval(attr.max) || 5;

          if (rating > starsMax) {
            rating = starsMax;
          }

          if (rating < 0) {
            rating = 0;
          }

          for (var i = 0; i < Math.floor(rating); i++) {
            scope.stars.push({state: 'fa-star'});
          }

          if (rating - Math.floor(rating) >= 0.5) {
            scope.stars.push({state: 'fa-star-half-full'});
          }

          while (attr.max && scope.stars.length < starsMax) {
            scope.stars.push({state: 'fa-star-o'});
          }
        };

        attr.$observe('mwRating', function () {
          buildStars();
        });

        attr.$observe('max', function () {
          buildStars();
        });
      }
    };
  })


  .directive('mwButtonHelp', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm) {
        var popup;
        elm.addClass('mwButtonHelp');
        var helpIcon = angular.element('<div>').addClass('help-icon rln-icon support hidden-sm hidden-xs');
        elm.prepend(helpIcon);

        helpIcon.hover(function () {
          buildPopup();
          var targetOffset = angular.element(this).offset();
          angular.element('body').append(popup);
          popup.css('top', targetOffset.top - (popup.height() / 2) + 10 - angular.element(document).scrollTop());
          popup.css('left', (targetOffset.left + 40));
        }, function () {
          angular.element('body > .mwButtonPopover').remove();
        });

        var buildPopup = function () {
          popup = angular.element('<div>' + scope.helpText + '<ul></ul></div>').addClass('mwButtonPopover popover');
          angular.forEach(scope.hintsToShow, function (hint) {
            popup.find('ul').append('<li>' + hint.text + '</li>');
          });
        };

        scope.$watch('hintsToShow', function (newVal) {
          if (newVal.length) {
            helpIcon.removeClass('hidden');
          } else {
            helpIcon.addClass('hidden');
          }
        });

        scope.$on('$destroy', function () {
          if (popup) {
            popup.remove();
          }
        });
      },
      controller: ['$scope', function ($scope) {
        $scope.registeredHints = [];
        $scope.hintsToShow = [];
        $scope.helpText = i18n.get('common.buttonHelp');
        $scope.$on('i18n:localeChanged', function () {
          $scope.helpText = i18n.get('common.buttonHelp');
        });

        var showHelp = function () {
          $scope.hintsToShow = [];
          angular.forEach($scope.registeredHints, function (registered) {
            if (registered.condition) {
              $scope.hintsToShow.push(registered);
            }
          });
        };

        //check if any condition changes
        this.register = function (registered) {
          $scope.$watch(function () {
            return registered.condition;
          }, showHelp);
          $scope.registeredHints.push(registered);
        };


      }]
    };
  }])

  .directive('mwButtonHelpCondition', function () {
    return {
      restrict: 'A',
      require: '^mwButtonHelp',
      scope: {
        condition: '=mwButtonHelpCondition',
        text: '@mwButtonHelpText'
      },
      link: function (scope, elm, attr, ctrl) {
        ctrl.register(scope);
      }
    };
  })

  .directive('mwLinkShow', function () {
    return {
      restrict: 'A',
      scope: {
        link: '@mwLinkShow'
      },
      template: '<a ng-href="{{ link }}" class="btn btn-default btn-sm mw-link-show" mw-stop-propagation="click"><span mw-icon="fa-angle-right"></span></a>'
    };
  })

  .directive('mwOptionGroup', function () {
    return {
      scope: {
        title: '@',
        description: '@',
        icon: '@',
        mwDisabled: '='
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwComponents/mwOptionGroup.html',
      link: function (scope, el) {
        scope.randomId = _.uniqueId('option_group_');
        el.find('input').attr('id', scope.randomId);
      }

    };
  })


/**
 * @ngdoc directive
 * @name mwComponents.directive:mwToggle
 * @element span
 * @description
 *
 * Displays a toggle button to toggle a boolean value
 *
 * @param {expression} mwModel model
 * @param {function} mwChange the function which should be executed when the value has changed
 *
 */
  .directive('mwToggle', ['$timeout', function ($timeout) {
    return {
      scope: {
        mwModel: '=',
        mwDisabled: '=',
        mwChange: '&'
      },
      replace: true,
      templateUrl: 'uikit/templates/mwComponents/mwToggle.html',
      link: function (scope) {
        scope.toggle = function (value) {
          if (scope.mwModel !== value) {
            scope.mwModel = !scope.mwModel;
            $timeout(function () {
              scope.mwChange({value: scope.mwModel});
            });
          }
        };
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwTimeline
 * @element div
 * @description
 *
 * Vertical timeline Is the container element for timeline entries
 *
 */
  .directive('mwTimeline', function () {
    return {
      transclude: true,
      replace: true,
      template: '<div class="mw-timeline timeline clearfix"><hr class="vertical-line"><div class="content" ng-transclude></div></div>'
    };
  })

  .directive('mwTimelineFieldset', ['$q', function ($q) {
    return {
      scope: {
        mwTitle: '@',
        collapsable: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/templates/mwComponents/mwTimelineFieldset.html',
      controller: ['$scope', function ($scope) {
        $scope.entries = [];
        this.register = function (entry) {
          if (!_.findWhere($scope.entries, {$id: entry.$id})) {
            $scope.entries.push(entry);
          }
        };
        $scope.entriesVisible = true;
        $scope.toggleEntries = function () {
          if (!$scope.collapsable) {
            return;
          }
          var toggleEntryHideFns = [];
          $scope.entries.forEach(function (entry) {
            if ($scope.entriesVisible) {
              toggleEntryHideFns.push(entry.hide());
            } else {
              toggleEntryHideFns.push(entry.show());
            }
          });
          if (!$scope.entriesVisible) {
            $scope.entriesVisible = !$scope.entriesVisible;
          } else {
            $q.all(toggleEntryHideFns).then(function () {
              $scope.entriesVisible = !$scope.entriesVisible;
            });
          }
        };
        $scope.hiddenEntriesText = function () {
          if ($scope.entries.length > 1) {
            return 'common.entriesHiddenPlural';
          } else {
            return 'common.entriesHiddenSingular';
          }
        };
      }]
    };
  }])

  .directive('mwTimelineEntry', ['$q', function ($q) {
    return {
      transclude: true,
      replace: true,
      template: '<li class="timeline-entry"><span class="bubble"></span><div ng-transclude></div></li>',
      scope: true,
      require: '^mwTimelineFieldset',
      link: function (scope, el, attrs, mwTimelineFieldsetController) {
        mwTimelineFieldsetController.register(scope);

        scope.hide = function () {
          var dfd = $q.defer();
          el.fadeOut('slow', function () {
            dfd.resolve();
          });
          return dfd.promise;
        };

        scope.show = function () {
          var dfd = $q.defer();
          el.fadeIn('slow', function () {
            dfd.resolve();
          });
          return dfd.promise;
        };
      }

    };
  }])


/**
 * @ngdoc directive
 * @name mwComponents.directive:mwDraggable
 * @description
 *
 * Offers drag and drop functionality on any element. Data can be set with the mwDragData parameter.
 * The drop callback of the mwDroppable element will receive this data.
 *
 */
  .directive('mwDraggable', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        mwDragData: '=',
        //We can not use camelcase because *-start is a reserved word from angular!
        mwDragstart: '&',
        mwDragend: '&',
        mwDropEffect: '@'
      },
      link: function (scope, el) {

        el.attr('draggable', true);
        el.addClass('draggable', true);

        if (scope.mwDragstart) {
          el.on('dragstart', function (event) {
            event.originalEvent.dataTransfer.setData('text', JSON.stringify(scope.mwDragData));
            event.originalEvent.dataTransfer.effectAllowed = scope.mwDropEffect;
            $timeout(function () {
              scope.mwDragstart({event: event, dragData: scope.mwDragData});
            });
          });
        }


        el.on('dragend', function (event) {
          if (scope.mwDragend) {
            $timeout(function () {
              scope.mwDragend({event: event});
            });
          }
        });
      }
    };
  }])

  .directive('mwDroppable', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        mwDropData: '=',
        mwDragenter: '&',
        mwDragleave: '&',
        mwDragover: '&',
        mwDrop: '&',
        disableDrop: '='
      },
      link: function (scope, el) {

        el.addClass('droppable');

        var getDragData = function (event) {
          var text = event.originalEvent.dataTransfer.getData('text');
          if (text) {
            return JSON.parse(text);
          }
        };

        if (scope.mwDragenter) {
          el.on('dragenter', function (event) {
            if (scope.disableDrop !== true) {
              el.addClass('drag-over');
            }
            $timeout(function () {
              scope.mwDragenter({event: event});
            });
          });
        }

        if (scope.mwDragleave) {
          el.on('dragleave', function (event) {
            el.removeClass('drag-over');
            $timeout(function () {
              scope.mwDragleave({event: event});
            });
          });
        }

        if (scope.mwDrop) {
          el.on('drop', function (event) {
            el.removeClass('drag-over');
            if (event.stopPropagation) {
              event.stopPropagation(); // stops the browser executing other event listeners which are maybe deined in parent elements.
            }
            var data = getDragData(event);
            $timeout(function () {
              scope.mwDrop({
                event: event,
                dragData: data,
                dropData: scope.mwDropData
              });
            });
            return false;
          });
        }

        // Necessary. Allows us to drop.
        var handleDragOver = function (ev) {
          if (scope.disableDrop !== true) {
            if (ev.preventDefault) {
              ev.preventDefault();
            }
            return false;
          }
        };
        el.on('dragover', handleDragOver);

        if (scope.mwDragover) {
          el.on('dragover', function (event) {
            $timeout(function () {
              scope.mwDragover({event: event});
            });
          });
        }

        scope.$on('$destroy', function () {
          el.off();
        });
      }
    };
  }])

  .directive('mwTextCollapse', ['$filter', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        mwTextCollapse: '@',
        length: '=',
        markdown: '='
      },
      templateUrl: 'uikit/templates/mwComponents/mwTextCollapse.html',
      link: function (scope) {

        // set default length
        if (scope.length && typeof scope.length === 'number') {
          scope.defaultLength = scope.length;
        } else {
          scope.defaultLength = 200;
        }

        // set start length for filter
        scope.filterLength = scope.defaultLength;

        // apply filter length to text
        scope.text = function () {
          return $filter('reduceStringTo')(
            scope.mwTextCollapse, scope.filterLength
          );
        };

        // show Button if text is longer than desired
        scope.showButton = false;
        if (scope.mwTextCollapse.length > scope.defaultLength) {
          scope.showButton = true;
        }

        // set button to "show more" or "show less"
        scope.showLessOrMore = function () {
          if (scope.filterLength === scope.defaultLength) {
            return 'common.showMore';
          } else {
            return 'common.showLess';
          }
        };

        // collapse/expand text by setting filter length
        scope.toggleLength = function () {
          if (scope.filterLength === scope.defaultLength) {
            delete scope.filterLength;
          } else {
            scope.filterLength = scope.defaultLength;
          }
        };
      }
    };
  }])


  .directive('mwInfiniteScroll', ['$window', '$document', function ($window, $document) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        var collection = scope.$eval(attrs.collection),
          loading = false,
          throttledScrollFn,
          scrollFn,
          documentEl,
          scrollEl;

        if (!collection || (collection && !collection.filterable)) {
          return;
        }

        var scrollCallback = function () {
          if (!loading && scrollEl.scrollTop() >= ((documentEl.height() - scrollEl.height()) - 100) && collection.filterable.hasNextPage()) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };
        var modalScrollCallback = function () {
          if (!loading &&
            collection.filterable.hasNextPage() &&
            scrollEl[0].scrollHeight > 0 &&
            (scrollEl[0].scrollHeight - scrollEl.scrollTop() - scrollEl[0].clientHeight < 2)) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };

        if (el.parents('.modal').length) {
          //element in modal
          scrollEl = el.parents('.modal-body');
          scrollFn = modalScrollCallback;
        }
        else {
          //element in window
          documentEl = angular.element($document);
          scrollEl = angular.element($window);
          scrollFn = scrollCallback;
        }

        throttledScrollFn = _.throttle(scrollFn, 500);

        // Register scroll callback
        scrollEl.on('scroll', throttledScrollFn);

        // Deregister scroll callback if scope is destroyed
        scope.$on('$destroy', function () {
          scrollEl.off('scroll', throttledScrollFn);
        });

      }
    };
  }])

  .directive('mwViewChangeLoader', ['$rootScope', function ($rootScope) {
    return {
      replace: true,
      template: '<div class="mw-view-change-loader" ng-if="model.loading"><div class="spinner"></div></div>',
      link: function (scope) {
        scope.model = {
          loading: false
        };

        var locationChangeSuccessListener = $rootScope.$on('$locationChangeSuccess', function () {
          scope.model.loading = true;
        });

        var routeChangeSuccessListener = $rootScope.$on('$routeChangeSuccess', function () {
          scope.model.loading = false;
        });

        var routeChangeErrorListener = $rootScope.$on('$routeChangeError', function () {
          scope.model.loading = false;
        });

        scope.$on('$destroy', function () {
          locationChangeSuccessListener();
          routeChangeSuccessListener();
          routeChangeErrorListener();
        });
      }
    };
  }])


  .directive('mwCollapsable', function () {
    return {
      transclude: true,
      scope: {
        mwCollapsable: '=',
        title: '@mwTitle'
      },
      templateUrl: 'uikit/templates/mwComponents/mwCollapsable.html',
      link: function (scope, elm) {
        scope.viewModel = {};
        scope.viewModel.collapsed = false;
        if (scope.mwCollapsable === false) {
          scope.viewModel.collapsed = true;
        }
        var level = elm.parents('.mw-collapsable').length;
        if (level) {
          elm.css('margin-left', level * 20 + 'px');
        }

        scope.toggle = function () {
          scope.viewModel.collapsed = !scope.viewModel.collapsed;
        };
      }
    };
  })

  .service('mwMarkdown', function(){
    var converter = new window.showdown.Converter({
      headerLevelStart: 3,
      smoothLivePreview: true,
      extensions: [function(){
        return [
          // Replace escaped @ symbols
          { type: 'lang', regex: '•', replace: '-' },
          { type: 'lang', filter: function(text){
            return text.replace(/https?:\/\/\S*/g, function(link){
              return '<'+link+'>';
            });
          }}
        ];
      }]
    });
    return {
      convert: function(val){
        return converter.makeHtml(val);
      }
    };
  })


  .directive('mwMarkdownPreview', function () {
    return {
      scope: {
        mwModel: '=mwMarkdownPreview'
      },
      templateUrl: 'uikit/templates/mwComponents/mwMarkdownPreview.html',
      link: function (scope, elm) {
        elm.addClass('mw-markdown-preview');
      }
    };
  })


  .directive('mwMarkdown', ['$sanitize', 'mwMarkdown', function ($sanitize, mwMarkdown) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        if (attrs.mwMarkdown) {
          scope.$watch(attrs.mwMarkdown, function (newVal) {
            try {
              var html = newVal ? $sanitize(mwMarkdown.convert(newVal)) : '';
              element.html(html);
            } catch (e) {
              element.text(newVal);
            }
          });
        } else {
          var html = $sanitize(mwMarkdown.convert(element.text()));
          element.html(html);
        }
      }
    };
  }]);

'use strict';

angular.module('mwComponentsBb', [])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwFilterableSearch
 * @element div
 * @description
 *
 * Creates a search field to filter by in the sidebar. Search is triggered on keypress 'enter'.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
  .directive('mwFilterableSearchBb', ['$timeout', '$animate', 'Loading', 'Detect', 'EmptyState', 'Persistance', function ($timeout, $animate, Loading, Detect, EmptyState, Persistance) {
    return {
      scope: {
        collection: '=',
        property: '@',
        customUrlParameter: '@',
        mwDisabled: '='
      },
      templateUrl: 'uikit/templates/mwComponentsBb/mwFilterableSearch.html',
      link: function (scope, elm) {
        $animate.enabled(false, elm.find('.search-indicator'));

        scope.inputLength = 0;
        var timeout,
            isMobile = Detect.isMobile();

        var getSearchText = function(){
          return scope.customUrlParameter ? scope.collection.filterable.customUrlParams[scope.customUrlParameter] : scope.collection.filterable.filterValues[scope.property];
        };

        var search = function () {
          //show search icon
          scope.searching = true;

          //persist filter values
          Persistance.saveFilterValues(scope.collection);

          //set property to setted filters on collection
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          EmptyState.pushFilter(scope.collection, property);

          //backup searched text to reset after fetch complete in case of search text was empty
          return scope.collection.fetch()
              .then(function(collection){
                if(getSearchText() === ''){
                  EmptyState.removeFilter(collection, property);
                }
              }).finally(function(){
                scope.searching = false;
              });
        };

        var throttler = function () {
          $timeout.cancel(timeout);
          timeout = $timeout(function () {
            search().then(function () {
              $timeout.cancel(timeout);
            });
          }, 500);
        };

        scope.search = function (event) {
          if (!event || event.keyCode === 13) {
            search();
          } else {

            if(!isMobile){
              throttler();
            }
          }
        };

        scope.reset = function () {
          if(scope.customUrlParameter) {
            scope.collection.filterable.customUrlParams[scope.customUrlParameter] = '';
          } else {
            scope.collection.filterable.filterValues[scope.property] = '';
          }
        };

        scope.showResetIcon = function() {
          //never show icon on mobile
          if(!scope.collection || isMobile){
            return false;
          }
          //return true if search text is undefined (ng-model is invalid e..g text is too long)
          if(angular.isUndefined(getSearchText())){
            return true;
          }
          //show icon when searchText is there
          return getSearchText().length > 0;
        };

        scope.performAction = function(){
          if(scope.showResetIcon() && !scope.searching) {
            scope.reset();
          }
          scope.search();
        };
      }
    };
  }])

  .directive('mwEmptyStateBb', ['EmptyState', function (EmptyState) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        collection: '=',
        text: '@mwEmptyStateBb',
        button: '&',
        buttonText: '@'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwComponentsBb/mwEmptyStateBb.html',
      link: function(scope){
        scope.showEmptyState = function(){
          return !scope.collection || (scope.collection.length === 0 && !EmptyState.hasFilters(scope.collection));
        };
      }
    };
  }])


  .directive('mwVersionSelector', function(){
    return {
      restrict: 'A',
      scope: {
        currentVersionModel: '=',
        versionCollection: '=',
        versionNumberKey: '@',
        url: '@'
      },
      templateUrl: 'uikit/templates/mwComponentsBb/mwVersionSelector.html',
      link: function(scope){
        scope.versionNumberKey = scope.versionNumberKey || 'versionNumber';
        scope.getUrl = function(uuid){
          return scope.url.replace('VERSION_UUID', uuid);
        };
      }
    };
  });





'use strict';

(function () {

  // Common used function to put defaults onto some HTML elements
  var extendHTMLElement = function () {
    return {
      restrict: 'E',
      require: '?^mwFormInput',
      link: function (scope, elm, attr, ctrl) {
        var formInputController = ctrl,
          skipTheFollowing = ['checkbox', 'radio'],
          dontSkipIt = skipTheFollowing.indexOf(attr.type) === -1;

        // Add default class coming from bootstrap
        if (dontSkipIt) {
          elm.addClass('form-control');
        }

        //append validation messages to element
        if (dontSkipIt && formInputController) {
          formInputController.buildValidationMessages(elm);
        }
      }
    };
  };

  var addDefaultValidations = function () {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {

        var ngModelController = ctrl,
          skipTheFollowing = ['checkbox', 'radio', 'hidden', 'file'],
          dontSkipIt = skipTheFollowing.indexOf(attr.type) === -1,
          _maxlength = 255, // for input fields of all types
          _maxIntValue = 2147483647;

        // use higher maxLength for textareas
        if (!attr.type) {
          _maxlength = 4000;
        }

        // Don't overwrite existing values for ngMaxlength
        if (attr.type !== 'number' && ngModelController && dontSkipIt && !ngModelController.$validators.maxlength && !attr.ngMaxlength) {
          attr.$set('ngMaxlength', _maxlength);
          ngModelController.$validators.maxlength = function (modelValue, viewValue) {
            return (_maxlength < 0) || ngModelController.$isEmpty(modelValue) || (viewValue.length <= _maxlength);
          };
        }

        //set max value for number fields
        if (attr.type === 'number' && !ctrl.$validators.max) {
          attr.$set('max', _maxIntValue);
          ctrl.$validators.max = function (value) {
            return ctrl.$isEmpty(value) || angular.isUndefined(_maxIntValue) || value <= _maxIntValue;
          };
        }
      }
    };
  };


  angular.module('mwForm', [])

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormInput
   * @element div
   * @description
   *
   * Wrapper for input elements. Adds validation messages, form HTML and corresponding CSS.
   * The following elements can register itself on mwFormInput:
   *
   * - select
   * - input[text]
   * - textarea
   *
   * @scope
   *
   * @param {string} label Label to show
   * @param {expression} hideErrors If true, doesn't show validation messages. Default is false
   *
   */
    .directive('mwFormInput', ['i18n', function (i18n) {
      return {
        restrict: 'A',
        transclude: true,
        require: '^form',
        scope: {
          label: '@',
          tooltip: '@',
          hideErrors: '='
        },
        templateUrl: 'uikit/templates/mwForm/mwFormInput.html',
        link: function (scope, elm, attr, ctrl) {

          var getElementCtrl = function(){
            if(ctrl && scope.elementName && ctrl[scope.elementName]){
              return ctrl[scope.elementName];
            }
          };


          scope.isInvalid = function() {
            var elCtrl = getElementCtrl();
            return (elCtrl) ? elCtrl.$invalid : false;
          };

          scope.isDirty = function () {
            var elCtrl = getElementCtrl();
            return (elCtrl) ? elCtrl.$dirty : false;
          };

          scope.getCurrentErrors = function(){
            var elCtrl = getElementCtrl();
            return (elCtrl) ? elCtrl.$error : undefined;
          };

          scope.isRequiredError = function(){
            var elCtrl = getElementCtrl();
            return (elCtrl && elCtrl.$error) ? elCtrl.$error.required : false;
          };

          scope.isRequired = function(){
            var requiredInputs = elm.find('input[required],select[required],textarea[required]');
            return requiredInputs.length>0;
          };


        },
        controller: ['$scope', function ($scope) {
          var that = this;
          that.element = null;

          this.buildValidationMessages = function (element) {
            if (!that.element) {
              that.element = element;

              $scope.$watch(function () {
                return element.attr('name');
              }, function (val) {
                if (val) {
                  $scope.elementName = val;
                }
              });

              $scope.$watch(function () {
                return element.attr('mw-validation-message');
              }, function (val) {
                if (val) {
                  buildValidationValues();
                }
              });

              var buildValidationValues = function () {
                $scope.validationValues = {
                  required: i18n.get('errors.isRequired'),
                  email: i18n.get('errors.hasToBeAnEmail'),
                  pattern: i18n.get('errors.hasToMatchPattern'),
                  url: i18n.get('errors.validUrl'),
                  min: i18n.get('errors.minValue', {count: element.attr('min')}),
                  minlength: i18n.get('errors.minLength', {count: element.attr('ng-minlength')}),
                  max: i18n.get('errors.maxValue', {count: element.attr('max')}),
                  maxlength: i18n.get('errors.maxLength', {count: element.attr('ng-maxlength')}),
                  phone: i18n.get('errors.phoneNumber'),
                  hex: i18n.get('errors.hex'),
                  unique: i18n.get('errors.notUnique'),
                  match: i18n.get('errors.doesNotMatch'),
                  emailOrPlaceholder: i18n.get('errors.emailOrPlaceholder'),
                  withoutChar: element.attr('mw-validation-message') || i18n.get('errors.withoutChar', {char: element.attr('mw-validate-without-char')}),
                  itunesOrHttpLink: i18n.get('errors.itunesOrHttpLink')
                };
              };
              buildValidationValues();
              $scope.$on('i18n:localeChanged', buildValidationValues);
            }
          };
        }]
      };
    }])

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormWrapper
   * @element div
   * @description
   *
   * Wrapper for custom elements. Adds form HTML and corresponding CSS.
   * Does not include validation or any other functional components.
   *
   * @scope
   *
   * @param {string} label Label to show
   * @param {string} tooltip Tooltip to display
   *
   */
    .directive('mwFormWrapper', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
          label: '@',
          tooltip: '@'
        },
        templateUrl: 'uikit/templates/mwForm/mwFormWrapper.html',
        link: function(scope, el){
          scope.isRequired = function(){
            var requiredInputs = el.find('input[required],select[required],textarea[required]');
            return requiredInputs.length>0;
          };
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwMultiSelect
   * @element div
   * @description
   *
   * Can be used for a selectbox where multiple values can be selected
   * Generates checkboxes and pushes or removes values into an array
   *
   * @scope
   *
   * @param {expression} model Model where the selected values should be saved in
   * @param {expression} options Options which can be selected
   *
   */
    .directive('mwFormMultiSelect', function () {
      return {
        restrict: 'A',
        transclude: true,
        require: '^?form',
        scope: {
          model: '=',
          options: '=',
          query: '=filter',
          mwRequired: '='
        },
        templateUrl: 'uikit/templates/mwForm/mwFormMultiSelect.html',
        controller: ['$scope', function ($scope) {

          if (!angular.isArray($scope.model)) {
            $scope.model = [];
          }

          if (angular.isArray($scope.options)) {
            var objOptions = {};
            $scope.options.forEach(function (option) {
              objOptions[option] = option;
            });

            $scope.options = objOptions;
          }

          $scope.getObjectSize = function (obj) {
            return _.size(obj);
          };

          $scope.filter = function (items) {
            var result = {};

            angular.forEach(items, function (value, key) {

              if (!$scope.query || !value || value.match($scope.query.toLowerCase()) || value.match($scope.query.toUpperCase())) {
                result[key] = value;
              }
            });
            return result;
          };

          $scope.toggleKeyIntoModelArray = function (key) {

            $scope.model = $scope.model || [];
            //Check if key is already in the model array
            //When user unselects a checkbox it will be deleted from the model array
            if ($scope.model.indexOf(key) >= 0) {
              // Delete key from model array
              $scope.model.splice($scope.model.indexOf(key), 1);
              // Delete model if no attribute is in there (for validation purposes)
              if ($scope.model.length === 0) {
                delete $scope.model;
              }
            } else {
              $scope.model.push(key);
            }
          };

        }],
        link: function (scope, el, attr, form) {

          scope.showRequiredMessage = function () {
            return ( (!scope.model || scope.model.length < 1) && scope.required);
          };

          scope.setDirty = function () {
            if (form) {
              form.$setDirty();
            }
          };
        }
      };
    })

    .directive('mwFormMultiSelect2', function () {
      return {
        restrict: 'A',
        transclude: true,
        require: '^?form',
        scope: {
          mwCollection: '=',
          mwOptionsCollection: '=',
          mwOptionsLabelKey: '@',
          mwOptionsLabelI18nPrefix: '@',
          mwRequired: '=',
          mwDisabled: '='
        },
        templateUrl: 'uikit/templates/mwForm/mwFormMultiSelect2.html',
        link: function (scope, elm, attr, formCtrl) {
          if (scope.mwOptionsCollection.length === 0) {
            scope.mwOptionsCollection.fetch();
          }

          scope.toggleModel = function (model) {
            var existingModel = scope.mwCollection.findWhere(model.toJSON());
            if (existingModel) {
              scope.mwCollection.remove(existingModel);
            } else {
              scope.mwCollection.add(model.toJSON());
            }
            if (formCtrl) {
              formCtrl.$setDirty();
            }
          };
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormCheckbox
   * @element div
   * @description
   *
   * Wrapper for checkbox elements. Adds form HTML and corresponding CSS.
   *
   * @scope
   *
   * @param {string} label Label to show
   *
   */
    .directive('mwFormCheckbox', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
          mwClass: '@class',
          label: '@',
          tooltip: '@',
          badges: '@'
        },
        templateUrl: 'uikit/templates/mwForm/mwFormCheckbox.html',
        link: function (scope) {
          if (scope.badges) {
            var formatBadges = function () {
              scope.typedBadges = [];
              var splittedBadges = scope.badges.split(',');
              angular.forEach(splittedBadges, function (badge) {
                var type = 'info';
                if (badge.toLowerCase().indexOf('android') > -1) {
                  type = 'android';
                }
                if (badge.toLowerCase().indexOf('ios') > -1) {
                  type = 'ios';
                }
                if (badge.toLowerCase().indexOf('knox') > -1) {
                  type = 'knox';
                }
                if (badge.toLowerCase().indexOf('-knox-') > -1) {
                  badge = 'KNOX';
                  type = 'notsafe';
                }
                if (badge.toLowerCase().indexOf('knox') > -1 &&
                  badge.toLowerCase().indexOf('android') > -1) {
                  type = 'multi';
                }
                scope.typedBadges.push({
                  text: badge,
                  type: type
                });
              });
            };
            scope.$watch('badges', formatBadges);
          }
        }
      };
    })

    .directive('mwCustomSelect', function () {
      return {
        require: '^?ngModel',
        link: function (scope, el, attrs, ngModel) {
          var customSelectWrapper = angular.element('<span class="custom-select mw-select"></span>');

          var render = function () {
            el.wrap(customSelectWrapper);
            el.addClass('custom');
          };

          scope.$watch(
            function () {
              return ngModel.$modelValue;
            },
            function (val) {
              if (angular.isUndefined(val)) {
                el.addClass('default-selected');
              } else {
                el.removeClass('default-selected');
              }
            }
          );

          render();
        }
      };
    })


  /**
   * @ngdoc directive
   * @name mwForm.directive:mwCustomCheckbox
   * @element input
   * @scope
   *
   * @param {boolean} radio If true, adds class 'round' to wrapping span element
   * @description
   *
   * Replaces native checkbox with custom checkbox
   *
   */
    .directive('mwCustomCheckbox', function () {
      return {
        restrict: 'A',
        link: function (scope, el, attr) {
          attr.$observe('radio', function (newVal) {
            if (newVal === true) {
              el.parent().addClass('round');
            }
          });

          // render custom checkbox
          // to preserve the functionality of the original checkbox we just wrap it with a custom element
          // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
          // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
          var render = function () {
            var customCheckbox = angular.element('<span class="custom-checkbox mw-checkbox"></span>'),
              customCheckboxStateIndicator = angular.element('<span class="state-indicator"></span>'),
              customCheckboxStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

            el.wrap(customCheckbox);
            customCheckboxStateIndicator.insertAfter(el);
            customCheckboxStateFocusIndicator.insertAfter(customCheckboxStateIndicator);
          };

          (function init() {
            //after this the remaining element is removed
            scope.$on('$destroy', function () {
              el.off();
              el.parent('.mw-checkbox').remove();
            });

            render();

          }());
        }
      };
    })

    .directive('mwCustomRadio', function () {
      return {
        restrict: 'A',
        link: function (scope, el) {
          // render custom checkbox
          // to preserve the functionality of the original checkbox we just wrap it with a custom element
          // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
          // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
          var render = function () {
            var customRadio = angular.element('<span class="custom-radio mw-radio"></span>'),
              customRadioStateIndicator = angular.element('<span class="state-indicator"></span>'),
              customRadioStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

            el.wrap(customRadio);
            customRadioStateIndicator.insertAfter(el);
            customRadioStateFocusIndicator.insertAfter(customRadioStateIndicator);
          };

          (function init() {
            //after this the remaining element is removed
            scope.$on('$destroy', function () {
              el.off();
              el.parent('.mw-radio').remove();
            });

            render();

          }());
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormValidation
   * @element span
   * @description
   * **Important!:** Can only be placed inside of {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   * Adds validation messages if validation for given key fails.
   *
   * @scope
   *
   * @param {string} mwFormsValidation The key to validate a model
   */
    .directive('mwFormValidation', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        require: ['^mwFormInput', '^form'],
        scope: {
          validation: '@mwFormValidation'
        },
        template: '<span class="help-block" ng-show="isValid()" ng-transclude></span>',
        link: function (scope, elm, attr, controllers) {
          var mwFormInputCtrl = controllers[0],
            inputName = mwFormInputCtrl.element.attr('name'),
            form = controllers[1],
            invalid = false;

          if (!inputName) {
            invalid = true;
            throw new Error('element doesn\'t have name attribute');
          }

          if (form && !form[inputName]) {
            invalid = true;
            throw new Error('element ' + inputName + ' not found');
          }

          scope.isValid = function () {
            if (invalid || !form) {
              return false;
            } else {
              if (form[inputName]) {
                return form[inputName].$error[scope.validation];
              }
            }
          };
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwForm
   * @element form
   * @description
   *
   * Adds form specific behaviour
   *
   */
    .directive('form', function () {
      return {
        restrict: 'E',
        link: function (scope, el) {
          el.addClass('form-horizontal');
          el.attr('novalidate', 'true');

          var noPasswordAutocomplete = angular.element(
            '<!-- fake fields are a workaround for chrome autofill getting the wrong fields -->' +
            '<input style="display:none" type="text" name="fakeusernameremembered"/>' +
            '<input style="display:none" type="password" name="fakepasswordremembered"/>'
          );

          el.prepend(noPasswordAutocomplete);
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwLeaveConfirmation
   * @element form
   * @description
   *
   * Opens a confirmation modal when the form has been edited and a the user wants to navigate to a new page
   *
   */

    .directive('mwFormLeaveConfirmation', ['$window', '$document', '$location', 'i18n', 'Modal', '$compile', function ($window, $document, $location, i18n, Modal, $compile) {
      return {
        require: '^form',
        link: function (scope, elm, attr, form) {
          scope.form = form;
          scope.text = i18n.get('common.confirmModal.description');
          var confirmation = $compile('<div mw-leave-confirmation="form.$dirty" text="{{text}}"></div>')(scope);
          elm.append(confirmation);

          scope.$on('$destroy', function () {
            scope.form.$dirty = false;
          });
        }
      };
    }])

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormActions
   * @element form
   * @description
   *
   * Adds buttons for save and cancel. Must be placed inside a form tag.
   * (Form controller has to be available on the parent scope!)
   *
   * @scope
   *
   * @param {expression} save Expression to evaluate on click on 'Save' button
   * @param {expression} cancel Expression to evaluate on click on 'cancel' button
   *
   */
    .directive('mwFormActions', ['Loading', '$route', function (Loading, $route) {
      return {
        replace: true,
        scope: {
          save: '&',
          cancel: '&',
          showSave: '=',
          showCancel: '='
        },
        templateUrl: 'uikit/templates/mwForm/mwFormActions.html',
        link: function (scope, elm, attr) {

          scope.isLoading = Loading.isLoading;

          scope.form = elm.inheritedData('$formController');
          scope.hasCancel = angular.isDefined(attr.cancel);
          scope.hasSave = angular.isDefined(attr.save);
          scope._showSave = true;
          scope._showCancel = true;
          scope.executeDefaultCancel = (attr.cancel === 'true');

          scope.$watch('showSave', function (val) {
            if (angular.isDefined(val)) {
              scope._showSave = val;
            }
          });

          scope.$watch('showCancel', function (val) {
            if (angular.isDefined(val)) {
              scope._showCancel = val;
            }
          });

          var setFormPristineAndEvaluate = function (exec) {
            if (scope.form) {
              scope.form.$setPristine();
            }
            scope.$eval(exec);
          };

          scope.saveFacade = function () {
            setFormPristineAndEvaluate(scope.save);
          };

          scope.cancelFacade = function () {
            if (scope.cancel && scope.executeDefaultCancel) {
              setFormPristineAndEvaluate(function () {
                $route.reload();
              });
            } else {
              setFormPristineAndEvaluate(scope.cancel);
            }
          };
        }
      };
    }])


  /**
   * @ngdoc directive
   * @name mwForm.directive:select
   * @restrict E
   * @description
   *
   * Extends the select element, by adding class 'form-control' and registers
   * it on {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   */
    .directive('select', extendHTMLElement)


  /**
   * @ngdoc directive
   * @name mwForm.directive:input
   * @restrict E
   * @description
   *
   * Extends the input[text] element, by adding class 'form-control' and
   * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   */
    .directive('input', extendHTMLElement)
    .directive('input', addDefaultValidations)

  /**
   * @ngdoc directive
   * @name mwForm.directive:textarea
   * @restrict E
   * @description
   *
   * Extends the textarea element, by adding class 'form-control' and
   * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   */
    .directive('textarea', extendHTMLElement)
    .directive('textarea', addDefaultValidations)

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwPasswordToggler
   * @element input
   * @description
   *
   * Adds an eye button for password fields to show the password in clear text
   *
   */
    .directive('mwPasswordToggler', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, el) {

        var render = function () {
          var passwordWrapper = angular.element('<div class="mw-password-toggler input-group"></div>'),
            passwordToggleBtn = $compile(
              '<span class="input-group-addon toggler-btn clickable" ng-click="togglePassword()" ng-if="showToggler()">' +
                '<span ng-if="isPassword()" mw-icon="fa-eye"></span>' +
                '<span ng-if="!isPassword()" mw-icon="fa-eye-slash"></span>' +
              '</span>')(scope);

          el.wrap(passwordWrapper);
          passwordToggleBtn.insertAfter(el);
        };

        scope.isPassword = function(){
          return el.attr('type')==='password';
        };

        scope.togglePassword = function(){
          if(scope.isPassword()){
            el.attr('type', 'text');
          } else {
            el.attr('type', 'password');
          }
        };


        scope.showToggler = function(){
          return !el.is(':disabled');
        };

        // remove input group class when input is disabled so it is displaaed like a normal input element
        scope.$watch(scope.showToggler, function(showToggler){
          var passwordWrapper = el.parent('.mw-password-toggler');
          if(showToggler){
            passwordWrapper.addClass('input-group');
          } else {
            passwordWrapper.removeClass('input-group');
          }
        });

        render();
      }
    };
  }]);

})();



'use strict';

angular.module('mwFormBb', [])

  .directive('mwFormMultiSelectBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        model: '=',
        collection: '=',
        mwOptionsKey: '@',
        translationPrefix: '@',
        mwRequired: '=',
        disabledCollection: '='
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormMultiSelect.html',
      link: function (scope, el, attr, form) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (!(scope.collection instanceof window.mCAP.Collection)) {
          throw new Error('mwFormMultiSelect: collection attribute has to be a collection');
        }

        if (scope.disabledCollection && !(scope.disabledCollection instanceof window.mCAP.Collection)) {
          throw new Error('mwFormMultiSelect: disabledCollection attribuet has to be a collection');
        }

        //When user unselects a checkbox it will be deleted from the model array
        var removeFromModel = function (key) {
          if (scope.model.indexOf(key) >= 0) {
            // Delete key from model array
            scope.model.splice(scope.model.indexOf(key), 1);
            // Delete model if no attribute is in there (for validation purposes)
            if (scope.model.length === 0) {
              delete scope.model;
            }
            return true;
          }
          return false;
        };

        if (scope.disabledCollection) {
          //if a an item is in the disabledCollection it will be removed from the model
          scope.disabledCollection.each(function (disabledModel) {
            removeFromModel(disabledModel.get(scope.optionsKey));
          });
        }

        scope.isDisabled = function (model) {
          if (scope.disabledCollection) {
            return !!scope.disabledCollection.get(model);
          }
        };

        scope.toggleKeyIntoModelArray = function (key) {
          scope.model = scope.model || [];
          if (!removeFromModel(key)) {
            scope.model.push(key);
          }
        };

        scope.showRequiredMessage = function () {
          return ( (!scope.model || scope.model.length < 1) && scope.mwRequired);
        };

        scope.setDirty = function () {
          if (form) {
            form.$setDirty();
          }
        };
      }
    };
  })

  .directive('mwFormRadioGroupBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        mwModel: '=',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormRadioGroup.html',
      link: function (scope) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }
      }
    };
  })

  .directive('mwFormSelectBb', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        mwModel: '=',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '=',
        mwChange: '&',
        mwPlaceholder: '@placeholder',
        mwAutoFetch: '=',
        name: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormSelect.html',
      link: function (scope) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        scope.viewModel = {
          val: ''
        };

        //auto fetch is default true
        if ((scope.mwAutoFetch === true || scope.mwAutoFetch === undefined) && scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }

        scope.getKey = function (optionModel) {
          return optionModel.get(scope.optionsKey);
        };

        scope.getLabel = function (optionModel) {
          if (!scope.mwOptionsLabelI18nPrefix) {
            return optionModel.get(scope.mwOptionsLabelKey);
          }
          return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + scope.getKey(optionModel));
        };

        scope.getSelectedModel = function (val) {
          var searchObj = {};
          searchObj[scope.optionsKey] = val;
          return scope.mwOptionsCollection.findWhere(searchObj);
        };


        if(scope.mwModel instanceof window.Backbone.Model){
          scope.viewModel.val = scope.mwModel.get(scope.optionsKey);
          scope.mwOptionsCollection.on('add', function(){
            if(scope.viewModel.val && scope.getSelectedModel(scope.viewModel.val)){
              scope.mwModel.set(scope.getSelectedModel(scope.viewModel.val).toJSON());
            }
          });
        } else {
          scope.viewModel.val = scope.mwModel;
          scope.$watch('mwModel', function(val){
            scope.viewModel.val = val;
          });
        }

        scope.$watch('viewModel.val', function(val){
          if(scope.mwModel instanceof window.Backbone.Model){
            if(val && scope.getSelectedModel(val)){
              scope.mwModel.set(scope.getSelectedModel(val).toJSON());
            } else {
              scope.mwModel.clear();
            }
          } else {
            scope.mwModel = val;
          }
        });

        if (!scope.mwPlaceholder && scope.mwRequired) {
          if (scope.mwOptionsCollection.length > 0) {
            if (_.isUndefined(scope.mwModel) || _.isNull(scope.mwModel)) {
              scope.mwModel = scope.mwOptionsCollection.first().get(scope.optionsKey);
            }
          } else {
            scope.mwOptionsCollection.once('add', function (model) {
              if (_.isUndefined(scope.mwModel) || _.isNull(scope.mwModel)) {
                scope.mwModel = model.get(scope.optionsKey);
              }
            });
          }
        }
      }
    };
  }])

  .directive('mwMultiSelectBoxes', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        inputCollection: '=mwOptionsCollection',
        selectedCollection: '=mwCollection',
        labelProperty: '@mwOptionsLabelKey',
        i18nPrefix: '@mwOptionsLabelI18nPrefix',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@hiddenFormElementName',
        placeholder: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwMultiSelectBoxes.html',
      link: function (scope) {

        //init collection with given values or one empty model if no data is provided
        scope.privateCollection = scope.selectedCollection.clone();
        if (scope.privateCollection.length === 0 && scope.inputCollection.first()) {
          var emptyClone = scope.inputCollection.first().clone().clear();
          scope.privateCollection.add(emptyClone);
        }

        //add empty model on + button
        scope.add = function () {
          var emptyClone = scope.inputCollection.first().clone().clear();
          scope.privateCollection.add(emptyClone);
        };

        //remove the specific model or the last (empty) one if model is not found
        scope.remove = function (model) {
          correctIds();
          if (_.isUndefined(model.id)) {
            scope.privateCollection.pop();
          }
          scope.privateCollection.remove(scope.privateCollection.get(model.id));
          if (scope.privateCollection.length === 0) {
            scope.add();
          }
          scope.change();
        };

        //only show the available models in options
        scope.collectionWithoutSelected = function (model) {
          //the current selected model should not be removed from the options
          var notInOptionsCollection = scope.privateCollection.clone();
          notInOptionsCollection.remove(model);

          //remove all already chosen models from options
          var filteredOptionsCollection = scope.inputCollection.clone();
          filteredOptionsCollection.remove(notInOptionsCollection.models);
          return filteredOptionsCollection;
        };

        //reset selected collection on every change
        scope.change = function () {
          scope.selectedCollection.reset(scope.privateCollection.models, {silent: true});
          scope.selectedCollection.each(function (model) {

            if (_.isUndefined(model.id)) {
              scope.selectedCollection.pop();
            }
          });
          scope.requiredValue = scope.selectedCollection.length ? true : null;
        };

        //get label to show in select boxes
        scope.getLabel = function (model) {
          var label = scope.labelProperty ? model.get(scope.labelProperty) : model.get('key');
          if (scope.i18nPrefix) {
            return i18n.get(scope.i18nPrefix + '.' + label);
          }
        };

        //helper method to reset the collections ids (we need this because the ng-model of the select directly replaces the model
        //and does not use the collections set function
        var correctIds = function () {
          var byId = {};
          scope.privateCollection.each(function (model) {
            byId[model.id] = model;
          });
          scope.privateCollection._byId = byId;
        };

        scope.change();
      }
    };
  }])

  .directive('mwMultiSelectBox', function () {
    return {
      restrict: 'A',
      templateUrl: 'uikit/templates/mwFormBb/mwMultiSelectBox.html'
    };
  });

'use strict';

(function () {

  var validateRegex = function (value, regex) {
    if (value) {
      return !!value.match(regex);
    } else {
      return true;
    }
  };

  angular.module('mwFormValidators', [])

  /**
   * @ngdoc directive
   * @name mwFormValidators.directive:mwValidatePhone
   * @element input
   * @description
   *
   * Adds validation for phone numbers.
   * Valid Examples are: +491234567 or 00491234567
   *
   * Note: this directive requires `ngModel` to be present.
   *
   */
    .directive('mwValidatePhone', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /^\+(?:[0-9]){6,14}[0-9]$/;

          var removeNonDigitValues = function (value) {
            if (value) {
              value = value.replace(/[^ 0-9+]/g, '');
            }
            return value;
          };

          var validateNumber = function (value) {
            return validateRegex(value, regex);
          };

          ngModel.$validators.phone = validateNumber;
          ngModel.$formatters.push(removeNonDigitValues);
        }
      };
    })

    .directive('mwValidateHex', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /^(0x)?([0-9A-Fa-f])+$/;

          var validateHex = function (value) {
            ngModel.$setValidity('hex', validateRegex(value, regex));
            return value;
          };

          ngModel.$formatters.push(validateHex);
          ngModel.$parsers.push(validateHex);
        }
      };
    })

    .directive('mwValidateCollectionOrModel', function () {
      return {
        restrict: 'A',
        scope: {
          mwModel: '=mwValidateCollectionOrModel',
          mwRequired: '=',
          mwKey: '@'
        },
        require: '^?form',
        template: '<input type="text" ng-required="mwRequired" ng-model="model.tmp" name="{{uId}}" style="display: none">',
        link: function (scope, el, attr, formController) {

          var key = scope.mwKey || 'uuid';

          scope.model = {};
          scope.uId = _.uniqueId('validator_');

          var setDirty = function(){
            if(formController){
              formController.$setDirty();
            }
          };

          var unwatch = scope.$watch('mwModel', function () {
            var val = scope.mwModel;
            if (val) {
              if (val instanceof window.Backbone.Collection) {
                val.on('add remove reset', function () {
                  if(val.length > 0){
                    scope.model.tmp = val.first().get(key);
                  } else {
                    scope.model.tmp = undefined;
                  }
                  setDirty();
                });
                if(val.length > 0){
                  scope.model.tmp = val.first().get(key);
                } else {
                  scope.model.tmp = undefined;
                }
              } else if (val instanceof window.Backbone.Model) {
                key = scope.mwKey || val.idAttribute;
                val.on('change:'+key, function () {
                  scope.model.tmp = val.get(key);
                  setDirty();
                });
                scope.model.tmp = val.get(key);
              } else {
                throw new Error('Value is neither a model nor a collection! Make its one of them', val);
              }
              unwatch();
            }
          });
        }
      };
    })

    .directive('mwValidatePlaceholder', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /\$\{.*\}/;


          var validatePlaceholder = function (value) {
            ngModel.$setValidity('placeholder', validateRegex(value, regex));
            return value;
          };

          ngModel.$formatters.push(validatePlaceholder);
          ngModel.$parsers.push(validatePlaceholder);
        }
      };
    })

    .directive('mwValidatePlaceholderOrMail', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+([.][a-zA-Z0-9_-]+)*[.][a-zA-Z0-9._-]+$/,
            placeholderRegex = /\$\{.+\}/;

          ngModel.$validators.emailOrPlaceholder = function(value){
            return !!(validateRegex(value, mailRegex) || validateRegex(value, placeholderRegex));
          };
        }
      };
    })

    .directive('mwValidateMatch', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ctrl) {
          var pwdWidget = elm.inheritedData('$formController')[attr.mwValidateMatch];

          ctrl.$parsers.push(function (value) {
            var isValid = false;
            if (value === pwdWidget.$viewValue) {
              isValid = true;
            }
            ctrl.$setValidity('match', isValid);
            return value;
          });

          pwdWidget.$parsers.push(function (value) {
            var isValid = false;
            if (value === ctrl.$viewValue) {
              isValid = true;
            }
            ctrl.$setValidity('match', isValid);
            return value;
          });
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwFormValidators.directive:mwValidateUniqueness
   * @element input
   * @description
   *
   * Adds validation of uniqueness for a given array of strings.
   *
   * @param {Array.<String>} mwValidateUniqueness Array of existing items to validate against
   *
   * Note: this directive requires `ngModel` to be present.
   *
   */
    .directive('mwValidateUniqueness', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var existingValues;

          scope.$watch(attr.mwValidateUniqueness, function (value) {
            existingValues = value;
          });

          /**
           * Add parser/formatter to model which checks if the model value is
           * a value that already exists and set validation state accordingly
           */
          var validateUniqueness = function (value) {
            var isValid = true;
            if (angular.isArray(existingValues) && existingValues.length > 0 && value && ngModel.$dirty) {
              isValid = (existingValues.indexOf(value) === -1);
            }
            ngModel.$setValidity('unique', isValid);
            return value;
          };
          ngModel.$parsers.unshift(validateUniqueness);
          ngModel.$formatters.unshift(validateUniqueness);
        }
      };
    })

    .directive('mwValidateWithoutChar', function(){
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          ngModel.$validators.withoutChar = function(value){
            if(_.isString(value)){
              return value.indexOf(attr.mwValidateWithoutChar) < 0;
            } else {
              return true;
            }
          };
        }
      };
    })

    .directive('mwValidateItunesOrHttpLink', function(){
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var itunesOrHttpLinkRegex = /^(https?|itms|itms-apps):\/\/.+$/;
          ngModel.$validators.itunesOrHttpLink = function(value){
            return validateRegex(value, itunesOrHttpLinkRegex);
          };
        }
      };
    });

})();
'use strict';

angular.module('mwHelper', [])

/**
 * @ngdoc directive
 * @name mwHelper.directive:mwStopPropagation
 * @element ANY
 * @param {string} mwStopPropagation the name of the event type
 *
 * @description
 * Stops Propagation of specified event for this element
 */
  .directive('mwStopPropagation', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwStopPropagation) {
          throw new Error('Directive mwStopPropagation: This directive must have an event name as attribute e.g. mw-stop-propagation="keyup"');
        }
        elm.on(attr.mwStopPropagation, function (event) {
          event.stopPropagation();
        });
      }
    };
  })

  .directive('mwPreventDefault', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwPreventDefault) {
          throw new Error('Directive mwPreventDefault: This directive must have an event name as attribute e.g. mw-prevent-default="click"');
        }
        elm.on(attr.mwPreventDefault, function (event) {
          event.preventDefault();
        });
      }
    };
  })


  .directive('mwSetDirtyOn', function(){
    return {
      restrict: 'A',
      scope: {
        mwSetDirtyOn: '@'
      },
      require: '^form',
      link: function (scope, elm, attr, formCtrl) {
        elm.on(scope.mwSetDirtyOn, function(){
          formCtrl.$setDirty();
        });
      }
    };
  })

  .service('mwDefaultFocusService', function(){
    var MwDefaultFocusService = function(){
        var _registeredFocusFields = [];
        this.register = function(id, el){
          _registeredFocusFields.push({
            id: id,
            el: el,
            active: false
          });
        };

        var update = function(id, newObj){
          var inputField = _.findWhere(_registeredFocusFields,{id:id}),
            index = _.indexOf(_registeredFocusFields,inputField);
            if(index>=0){
              _registeredFocusFields[index] = newObj;
            }
        };

        this.setFocus = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id});
          if(this.getFocusedField() && this.getFocusedField().id !== id){
            throw new Error('There can be only one focused field');
          }
          if(inputField){
            inputField.active = true;
            update(inputField);
          }
        };

        this.removeFocus = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id});
          if (inputField){
            inputField.active = false;
            update(inputField);
          }
        };

        this.toggleFocus = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id});
          if(inputField){
            inputField.active = !inputField.active;
            update(inputField);
          }
        };

        this.getFocusedField = function(){
          return _.findWhere(_registeredFocusFields,{active:true});
        };

        this.remove = function(id){
          var inputField = _.findWhere(_registeredFocusFields,{id:id}),
              index = _.indexOf(_registeredFocusFields,inputField);
          if(index>=0){
            _registeredFocusFields.splice(index,1);
          }
        };
    };

    return new MwDefaultFocusService();
  })

  .directive('mwDefaultFocus', ['mwDefaultFocusService', function (mwDefaultFocusService) {
    return {
      restrict: 'A',
      scope:{
        isFocused: '=mwDefaultFocus'
      },
      link: function (scope, el) {
        var id = _.uniqueId('focus_field');
        mwDefaultFocusService.register(id, el);

        var setFocus = function(){
          if(el.is(':focus')){
            return;
          } else {
            try{
              mwDefaultFocusService.setFocus(id);
              el[0].focus();
              window.requestAnimFrame(setFocus);
            } catch(err){
              console.warn(err);
            }

          }
        };

        scope.$watch('isFocused',function(isFocused){
          if(isFocused){
            window.requestAnimFrame(setFocus);
          } else {
            el[0].blur();
            mwDefaultFocusService.removeFocus(id);
          }
        });

        scope.$on('$destroy',function(){
          mwDefaultFocusService.remove(id);
        });
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwForm.directive:mwLeaveConfirmation
 * @element form
 * @description
 *
 * Opens a confirmation modal when the form has been edited and a the user wants to navigate to a new page
 *
 */

  .directive('mwLeaveConfirmation', ['$window', '$document', '$location', '$rootScope', 'i18n', 'Modal', function ($window, $document, $location, $rootScope, i18n, Modal) {
    return {
      scope: {
        alertBeforeLeave: '=mwLeaveConfirmation',
        text:'@'
      },
      link: function (scope) {

        var confirmationModal = Modal.create({
          templateUrl: 'uikit/templates/mwForm/mwLeaveConfirmation.html',
          scope: scope
        });

        // Prevent the original event so the routing will not be completed
        // Save the url where it should be navigated to in a temp variable
        var showConfirmModal = function (ev, next) {
          if (scope.alertBeforeLeave) {
            confirmationModal.show();
            ev.preventDefault();
            scope.next = next;
          } else {
            scope.changeLocationOff();
          }
        };

        // User wants to stay on the page
        scope.stay = function () {
          confirmationModal.hide();
        };

        // User really wants to navigate to that page which was saved before in a temp variable
        scope.continue = function () {
          if (scope.next) {
            //instead of scope.$off() we call the original eventhandler function
            scope.changeLocationOff();

            //hide the modal and navigate to the page
            confirmationModal.hide().then(function () {
                document.location.href=scope.next;
                scope.next = null;
            });
          }
        };

        //In case that just a hashchange event was triggered
        //Angular has no $off event unbinding so the original eventhandler is saved in a variable
        scope.changeLocationOff = $rootScope.$on('$locationChangeStart', showConfirmModal);

        //In case that the user clicks the refresh/back button or makes a hard url change
        $window.onbeforeunload = function () {
          if (scope.alertBeforeLeave && $rootScope.leaveConfirmationEnabled) {
            return scope.text;
          }
        };

        if(!angular.isDefined(scope.text)){
          throw new Error('Please specify a text in the text attribute');
        }

        $rootScope.leaveConfirmationEnabled = true;
      }
    };
  }])

  .service('LayoutWatcher', ['$timeout', '$window', function ($timeout, $window) {

    var _callbacks = [];
    var _notify = function(){
      _callbacks.forEach(function(scopedCallback){
        scopedCallback.callback.apply(scopedCallback.scope);
      });
    };
    angular.element('body').on('DOMNodeInserted',_.throttle(_notify, 300));
    angular.element('body').on('DOMNodeRemoved',_.throttle(_notify, 300));
    angular.element($window).on('resize', _.throttle(_notify, 300));
    $timeout(_notify,500);
    return {
      registerCallback: function(cb,scope){
        if(typeof cb  === 'function'){
          var scopedCallback = {
            callback: cb,
            scope: scope
          };
          _callbacks.push(scopedCallback);
        } else {
          throw new Error('Callback has to be a function');
        }
      }
    };
  }])

  .directive('mwSetFullScreenHeight', ['LayoutWatcher', function (LayoutWatcher) {
    return {
      restrict: 'A',
      scope:{
        'subtractElements':'=',
        'offset':'@'
      },
      link: function (scope, el) {

        el.addClass('mw-full-screen-height');

        var setHeight = function(){
          var height = angular.element(window).height();

          scope.subtractElements.forEach(function(elIdentifier){
            var $el = angular.element(elIdentifier);
            if($el){
              var padding = {
                    top: parseInt($el.css('padding-top'),10),
                    bottom: parseInt($el.css('padding-bottom'),10)
                  };
              height -= $el.height();
              height -= padding.top;
              height -= padding.bottom;
            }
          });
          if(scope.offset){
            height -= scope.offset;
          }
          el.css('height',height);
        };

        LayoutWatcher.registerCallback(setHeight);

      }
    };
  }])


  .directive('mwInvertModelValue', function (){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attr, ngModelCtrl){
        var invert = function(value){
          if(typeof(value) === 'boolean') {
            return !value;
          }
          return value;
        };
        ngModelCtrl.$parsers.push(invert);
        ngModelCtrl.$formatters.push(invert);
      }
    };
  })

  .directive('mwRemoveXs', ['Detect', function(Detect){
    return{
      priority: 1,
      link: function(scope,el){
        if(Detect.isSmartphone()){
          el.remove();
          scope.$destroy();
        }
      }
    };
  }])

  .directive('mwRemoveMd', ['Detect', function(Detect){
    return{
      priority: 1,
      link: function(scope,el){
        if(Detect.isSmartphone() || Detect.isTablet()){
          el.remove();
          scope.$destroy();
        }
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name mwHelper.directive:mwAutofillCheck
   * @element ANY
   *
   * @description
   * Workaround for Firefox auto fill bug for input directives. Place this directive on a form tag.
   */
  .directive('mwAutofillCheck', ['$interval', function($interval){
    return {
      restrict: 'A',
      link: function( scope, elm ){
        var inputElements = elm.find('input');
        var stopInterval = null;

        inputElements.on('keyup', function(){
          if(stopInterval === null){
            stopInterval = $interval(function(){
              inputElements.trigger('input').trigger('change').trigger('keydown');
            }, 500);
          }
        });

        scope.$on('$destroy', function(){
          $interval.cancel(stopInterval);
        });
      }
    };
  }]);
/**
 * Created by zarges on 27/05/15.
 */
'use strict';

angular.module('mwI18n', [])

  .provider('i18n', function () {

    var _resources = [],
      _locales = [],
      _dictionary = {},
      _isLoadingresources = false,
      _oldLocale = null,
      _defaultLocale = null;

    var _setActiveLocale = function (locale) {
      var oldLocale = _getActiveLocale(),
        newLocale = _.findWhere(_locales, {id: locale});

      if (newLocale) {
        if (oldLocale) {
          oldLocale.active = false;
        }

        newLocale.active = true;
      } else {
        throw new Error('You can not set a locale that has not been registered. Please register the locale first by calling addLocale()');
      }
    };

    var _getActiveLocale = function () {
      // This variable was set from 'LanguageService' in method setDefaultLocale()
      return _.findWhere(_locales, {active: true});
    };

    /**
     * Returns a translation for a key when a translation is available otherwise false
     * @param key {String}
     * @returns {*}
     * @private
     */
    var _getTranslationForKey = function (key) {
      var activeLocale = _oldLocale || _getActiveLocale();

      if(activeLocale && _dictionary && _dictionary[activeLocale.id]){
        var translation = _dictionary[activeLocale.id];
        angular.forEach(key.split('.'), function (k) {
          translation = translation ? translation[k] : null;
        });
        return translation;
      } else {
        return false;
      }
    };

    /**
     * Checks all locales for an available translation until it finds one
     * @param property {String}
     * @returns {*}
     * @private
     */
    var _getContentOfOtherLocale = function (property) {
      var result;
      _.each(_locales, function (locale) {
        if (!result && property[locale.id]) {
          result = property[locale.id];
        }
      });
      if(!result){
        result = _.values(property)[0];
      }
      return result;
    };

    /**
     * Return all placeholders that are available in the translation string
     * @param property {String}
     * @returns {String}
     * @private
     */
    var _getUsedPlaceholdersInTranslationStr = function(str){

      var re = /{{([a-zA-Z0-9$_]+)}}/g,
          usedPlaceHolders = [],
          matches;

      while ((matches = re.exec(str)) !== null) {
        if (matches.index === re.lastIndex) {
          re.lastIndex++;
        }
        usedPlaceHolders.push(matches[1]);
      }

      return usedPlaceHolders;
    };

    /**
     * Replaces placeholders in transaltion string with a value defined in the placeholder param
     * @param str
     * @param placeholder
     * @returns {String}
     * @private
     */
    var _replacePlaceholders = function (str, placeholders) {
      if(placeholders){
        var usedPlaceHolders = _getUsedPlaceholdersInTranslationStr(str);
        usedPlaceHolders.forEach(function(usedPlaceholder){
          str = str.replace('{{' + usedPlaceholder + '}}', placeholders[usedPlaceholder]);
        });
      }
      return str;
    };

    /**
     * Registers a locale for which translations are available
     * @param locale
     * @param name
     * @param fileExtension
     */
    this.addLocale = function (locale, name, fileExtension) {
      if (!_.findWhere(_locales, {id: locale})) {
        _locales.push({
          id: locale,
          name: name,
          active: locale === _defaultLocale,
          fileExtension: fileExtension || locale + '.json'
        });
        _dictionary[locale] = {};
      }
    };

    /**
     * Registers a resource so it can be accessed later by calling the public method get
     * @param resourcePath {String}
     * @param fileNameForLocale {String}
     */
    this.addResource = function (resourcePath) {
      if (!_.findWhere(_resources, {path: resourcePath})) {
        _resources.push({
          path: resourcePath
        });
      }
    };

    this.setDefaultLocale = function (locale) {
      _defaultLocale = locale;
      if(_.findWhere(_locales, {id: locale})){
        _setActiveLocale(locale);
      }
    };

    this.$get = ['$templateRequest', '$q', '$rootScope', function ($templateRequest, $q, $rootScope) {
      return {
        /**
         * Fills the dictionary with the translations by using the angular templateCache
         * We need the dictionary because the get method has to be synchronous for the angular filter
         * @param resourcePath {String}
         */
        _loadResource: function (resourcePath) {
          var resource = _.findWhere(_resources, {path: resourcePath}),
            activeLocale = this.getActiveLocale(),
            fileName = '';

          if (resource && activeLocale) {
            fileName = activeLocale.fileExtension;

            return $templateRequest(resource.path + '/' + fileName).then(function (content) {
              _.extend(_dictionary[activeLocale.id], JSON.parse(content));
              return content;
            });
          } else {
            return $q.reject('Resource not available or no locale has been set');
          }
        },

        /**
         * Returns all registered locales
         * @returns {Array}
         */
        getLocales: function(){
          return _locales;
        },

        /**
         * Return the currently active locale
         * @returns {Object}
         */
        getActiveLocale: function () {
          return _getActiveLocale();
        },

        /**
         * translates key into current locale, given placeholders in {{placeholderName}} are replaced
         * @param key {String}
         * @param placeholder {Object}
         */
        get: function (key, placeholder) {
            var translation = _getTranslationForKey(key);
            if (translation) {
              return _replacePlaceholders(translation, placeholder);
            } else if(_isLoadingresources){
              return '...';
            } else {
              return 'MISSING TRANSLATION ' + this.getActiveLocale().id + ': ' + key;
            }
        },

        /**
         * set the locale and loads all resources for that locale
         * @param locale {String}
         */
        setLocale: function (localeid) {
          var loadTasks = [];
          _isLoadingresources = true;
          _oldLocale = this.getActiveLocale();
          _setActiveLocale(localeid);
          _.each(_resources, function (resource) {
            loadTasks.push(this._loadResource(resource.path));
          }, this);
          return $q.all(loadTasks).then(function () {
            _isLoadingresources = false;
            _oldLocale = null;
            $rootScope.$broadcast('i18n:localeChanged', localeid);
            return localeid;
          });
        },

        /**
         * checks if a translation for the key is available
         * @param key {String}
         * @returns {boolean}
         */
        translationIsAvailable: function(key){
          return !!_getTranslationForKey(key);
        },
        /**
         * return value of an internationalized object e.g {en_US:'English text', de_DE:'German text'}
         * When no translation is availabe for the current set locale it tries the default locale.
         * When no translation is available for the defaultLocale it tries all other available locales until
         * a translation is found
         * @param property {object}
         * @returns {String}
         */
        localize: function (property) {
          var activeLocale = this.getActiveLocale();
          var p = property[activeLocale.id];
          if (angular.isDefined(p) && p !== '') {
            return p;
          } else {
            return property[_defaultLocale] || _getContentOfOtherLocale(property);
          }
        }
      };
    }];

  })

  .filter('i18n', ['i18n', function (i18n) {

    function i18nFilter(translationKey, placeholder) {
      if (_.isString(translationKey)) {
        return i18n.get(translationKey, placeholder);
      } else if(_.isObject(translationKey)){
        return i18n.localize(translationKey);
      }
    }

    i18nFilter.$stateful = true;

    return i18nFilter;
  }]);
'use strict';

angular.module('mwListable', [])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListable
 * @element table
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} selectable Instance of selectable for this listable item
 * @param {string} filterable Instance of filterable for this listable item. Needed for pagination.
 * @example
 * <doc:example>
 *   <doc:source>
 *    <table mw-listable
 *           selectable="selectable"
 *           filterable="filterable">
 *      <thead>
 *        <tr>
 *          <th mw-listable-header>A column</th>
 *        </tr>
 *      </thead>
 *      <tbody>
 *        <tr ng-repeat="item in filterable.items()">
 *          <td>Column content</td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </doc:source>
 * </doc:example>
 */
    .directive('mwListable', ['$compile', '$window', '$document', function ($compile, $window, $document) {

      return {
        restrict: 'A',
        scope: {
          selectable: '=',
          filterable: '='
        },
        compile: function  (elm) {

          elm.append('<tfoot mw-listable-footer></tfoot>');

          return function (scope, elm) {
            elm.addClass('table table-striped mw-listable');

            /**
             * Infinite scrolling
             */
            var scrollCallback = function () {
              if(scope.filterable){
                if (w.scrollTop() >= (d.height() - w.height())*0.8) {
                  scope.filterable.loadMore();
                }
              }
            };
            var modalScrollCallback = function () {
              if(scope.filterable &&
                 modalBody[0].scrollHeight > 0 &&
                 (modalBody[0].scrollHeight - modalBody.scrollTop() - modalBody[0].clientHeight < 2)) {
                scope.filterable.loadMore();
              }
            };

            if(elm.parents('.modal').length){
              //filterable in modal
              var modalBody = elm.parents('.modal-body');

              // Register scroll callback
              modalBody.on('scroll', modalScrollCallback);

              // Deregister scroll callback if scope is destroyed
              scope.$on('$destroy', function () {
                modalBody.off('scroll', modalScrollCallback);
              });
            } else {
              //filterable in document
              var w = angular.element($window);
              var d = angular.element($document);

              // Register scroll callback
              w.on('scroll', scrollCallback);

              // Deregister scroll callback if scope is destroyed
              scope.$on('$destroy', function () {
                w.off('scroll', scrollCallback);
              });
            }
          };
        },
        controller: ['$scope', function ($scope) {
          var columns = $scope.columns = [];

          this.actionColumns = [];

          this.sort = function (property, order) {
            if($scope.filterable){
              $scope.filterable.setSortOrder(order + property);
            }
          };

          this.getSort = function () {
            if($scope.filterable){
              return $scope.filterable.sortOrder();
            }
          };

          this.registerColumn = function (scope) {
            columns.push(scope);
          };

          this.getColumns = function() {
            return columns;
          };

          this.getFilterable = function () {
            return $scope.filterable;
          };

          this.getSelectable = function () {
            return $scope.selectable;
          };

          this.toggleAll = function () {
            if ($scope.selectable.allSelected()) {
              $scope.selectable.unselectAll();
            } else {
              $scope.selectable.selectAll();
            }
          };

          this.isRadio = function(){
            if($scope.selectable){
              return $scope.selectable.isRadio();
            }
            return false;
          };
        }]
      };
    }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHead
 * @element thead
 * @description
 *
 * Displays amount of items from filterable and the amount of selected items of the selectable
 *
 */

  .directive('mwListableHead', ['$compile', function($compile) {
    return {
      require: '^mwListable',
      scope:{
        title:'@mwListableHead'
      },
      link: function(scope,el,attr,mwListable){
        scope.filterable = mwListable.getFilterable();
        scope.selectable = mwListable.getSelectable();

        var tmpl = '<tr>' +
          '<th colspan="20" class="listable-amount" ng-if="filterable.total()">' +
            '<span ng-if="selectable.selected().length>0">{{selectable.selected().length}}/{{filterable.total()}} {{title}} {{ \'common.selected\' | i18n }}</span>' +
            '<span ng-if="!selectable || selectable.selected().length<1">{{filterable.total()}} {{title}}</span>' +
          '</th>' +
        '</tr>',
        $tmpl = angular.element(tmpl),
        compiled = $compile($tmpl);

        el.prepend($tmpl);
        compiled(scope);
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableFooter
 * @element tfoot
 * @description
 *
 * Displays footer with:
 * * loading spinner if list is loading
 * * 'none found' message if filterable is empty
 * * 'load more' button for pagination
 *
 */

    .directive('mwListableFooter', ['Loading', function(Loading) {
      return {
        require: '^mwListable',
        templateUrl: 'uikit/templates/mwListable/mwListableFooter.html',
        link: function(scope, elm, attr, mwListableCtrl) {
          scope.Loading = Loading;
          scope.columns = mwListableCtrl.getColumns();
        }
      };
    }])


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeader
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} sort Property key of the model to sort by
 */
    .directive('mwListableHeader', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          property: '@sort',
          width:'@',
          sortActive:'='
        },
        transclude: true,
        replace:true,
        templateUrl: 'uikit/templates/mwListable/mwListableHeader.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          var ascending = '+',
              descending = '-';

          scope.toggleSortOrder = function () {
            if (scope.property) {
              var sortOrder = ascending; //default
              if (mwListableCtrl.getSort() === ascending + scope.property) {
                sortOrder = descending;
              }
              mwListableCtrl.sort(scope.property, sortOrder);
            }
          };

          scope.isSelected = function (prefix) {
            if(prefix){
              return mwListableCtrl.getSort() === prefix + scope.property;
            } else {
              return (mwListableCtrl.getSort() === '+' + scope.property || mwListableCtrl.getSort() === '-' + scope.property);
            }
          };

          if(scope.property){
            elm.find('.title').on('click',scope.toggleSortOrder);
          }

          mwListableCtrl.registerColumn(scope);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableColumnCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select item' checkbox in content.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableColumnCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          mwDisabled: '=',
          item: '='
        },
        templateUrl: 'uikit/templates/mwListable/mwListableColumnCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.selectable = mwListableCtrl.getSelectable();
          scope.radio = mwListableCtrl.isRadio();
          scope.click = function (item, $event) {
            $event.stopPropagation();
            scope.selectable.toggle(item);
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header.
 *
 * @scope
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        templateUrl: 'uikit/templates/mwListable/mwListableHeaderCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.radio = mwListableCtrl.isRadio();
          scope.filterable = mwListableCtrl.getFilterable();
          scope.selectable = mwListableCtrl.getSelectable();
          scope.toggleAll = mwListableCtrl.toggleAll;
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableRow
 * @element tr
 * @description
 *
 * Directive for table row. Adds click actions. And class 'selected' if row is selected.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableBodyRow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        compile: function (elm) {

          elm.prepend('<td ng-if="selectable" mw-listable-column-checkbox mw-disabled="isDisabled()" item="item"></td>');

          return function (scope, elm, attr) {
            var selectedClass = 'selected';
            if(scope.selectable){
              elm.addClass('selectable');
            }

            elm.on('click', function () {
              if (scope.selectable && !scope.isDisabled(scope.item)) {
                scope.selectable.toggle(scope.item);
                scope.$apply();
              }
            });

            scope.$watch('selectable.isSelected(item)', function (value) {
              if(value) {
                elm.addClass(selectedClass);
              } else {
                elm.removeClass(selectedClass);
              }
            });

            scope.isDisabled = function () {
              return scope.$eval(attr.mwListableDisabled, { item: scope.item });
            };
          };
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderRow
 * @element tr
 * @description
 *
 * Directive for table header row. Adds mw-listable-header-checkbox if selectable is present and th tags for actionColumns.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderRow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        compile: function (elm) {
          elm.prepend('<th ng-if="selectable" mw-listable-header-checkbox width="1%"></th>');
          elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

          return function (scope, elm, attr, mwListableCtrl) {
            scope.selectable = mwListableCtrl.getSelectable();
            scope.actionColumns = mwListableCtrl.actionColumns;
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkEdit
 * @element td
 * @description
 *
 * Directive to add a button link to edit a dataset.
 *
 * @param {string} mwListableLinkEdit URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableLinkEdit', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          link: '@mwListableLinkEdit'
        },
        template: '<a ng-href="{{ link }}" class="btn btn-default btn-sm"><span mw-icon="rln-icon edit"></span></a>',
        link: function (scope, elm, attr, mwListableCtrl) {
          mwListableCtrl.actionColumns.push(null);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkShow
 * @element td
 * @description
 *
 * Directive to add a button link to show a dataset.
 *
 * @param {string} mwListableLinkShow URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableLinkShow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          link: '@mwListableLinkShow'
        },
        template: '<span mw-link-show="{{link}}"></span>',
        link: function (scope, elm, attr, mwListableCtrl) {
          mwListableCtrl.actionColumns.push(null);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwRowIdentifier
 * @description
 *
 * Directive that adds title attribute to th and td elements. Used to hide columns in css for special branding
 *
 * @param {string} mwRowIdentifier the title to be used
 *
 */
    .directive('mwRowIdentifier', function () {
      return {
        restrict: 'A',
        link: function (scope, elm, attr) {
          if(attr.mwRowIdentifier){
            attr.$set('title', attr.mwRowIdentifier);
          }
        }
      };
    })
;
'use strict';

angular.module('mwListableBb', [])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListable
 * @element table
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} selectable Instance of selectable for this listable item
 * @param {string} filterable Instance of filterable for this listable item. Needed for pagination.
 * @example
 * <doc:example>
 *   <doc:source>
 *    <table mw-listable
 *           selectable="selectable"
 *           filterable="filterable">
 *      <thead>
 *        <tr>
 *          <th mw-listable-header>A column</th>
 *        </tr>
 *      </thead>
 *      <tbody>
 *        <tr ng-repeat="item in filterable.items()">
 *          <td>Column content</td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </doc:source>
 * </doc:example>
 */
  .directive('mwListableBb', ['Persistance', function (Persistance) {

    return {
      restrict: 'A',
      scope: {
        collection: '='
      },
      compile: function (elm) {
        elm.append('<tfoot mw-listable-footer-bb></tfoot>');

        return function (scope, elm) {
          elm.addClass('table table-striped mw-listable');
        };
      },
      controller: ['$scope', function ($scope) {
        var columns = $scope.columns = [],
          self = this;

        this.actionColumns = [];

        this.sort = function (property, order) {
          var sortOrder = order + property;
          Persistance.saveSortOrder(sortOrder, $scope.collection);
          $scope.collection.filterable.setSortOrder(sortOrder);
          $scope.collection.fetch();
        };

        this.getSortOrder = function () {
          return $scope.collection.filterable.getSortOrder();
        };

        this.registerColumn = function (scope) {
          columns.push(scope);
        };

        this.unRegisterColumn = function (scope) {
          if (scope && scope.$id) {
            var scopeInArray = _.findWhere(columns, {$id: scope.$id}),
              indexOfScope = _.indexOf(columns, scopeInArray);

            if (indexOfScope > -1) {
              columns.splice(indexOfScope, 1);
            }
          }
        };

        this.getColumns = function () {
          return columns;
        };

        this.getCollection = function () {
          return $scope.collection;
        };

        this.isSingleSelection = function () {
          if ($scope.collection && $scope.collection.selectable) {
            return $scope.collection.selectable.isSingleSelection();
          }
          return false;
        };

        $scope.$on('$destroy', function () {
          self.actionColumns = [];
        });
      }]
    };
  }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHead
 * @element thead
 * @description
 *
 * Displays amount of items from filterable and the amount of selected items of the selectable
 *
 */

  .directive('mwListableHeadBb', ['$compile', function ($compile) {
    return {
      require: '^mwListableBb',
      scope: {
        title: '@mwListableHeadBb',
        noCounter: '='
      },
      link: function (scope, el, attr, mwListable) {
        scope.collection = mwListable.getCollection();

        if (angular.isUndefined(scope.noCounter)) {
          var tmpl = '<tr>' +
              '<th colspan="20" class="listable-amount" ng-if="collection.filterable.getTotalAmount()">' +
              '<span ng-if="collection.selectable.getSelected().length > 0">{{collection.selectable.getSelected().length}}/{{collection.filterable.getTotalAmount() || collection.length}} {{title}} {{ \'common.selected\' | i18n }}</span>' +
              '<span ng-if="!collection.selectable || collection.selectable.getSelected().length<1">{{collection.filterable.getTotalAmount() || collection.length}} {{title}}</span>' +
              '</th>' +
              '</tr>',
            $tmpl = angular.element(tmpl),
            compiled = $compile($tmpl);

          el.prepend($tmpl);
          compiled(scope);
        }
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableFooter
 * @element tfoot
 * @description
 *
 * Displays footer with:
 * * loading spinner if list is loading
 * * 'none found' message if filterable is empty
 * * 'load more' button for pagination
 *
 */

  .directive('mwListableFooterBb', ['Loading', function (Loading) {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/templates/mwListableBb/mwListableFooter.html',
      link: function (scope, elm, attr, mwListableCtrl) {
        scope.Loading = Loading;
        scope.collection = mwListableCtrl.getCollection();
        scope.columns = mwListableCtrl.getColumns();
      }
    };
  }])


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeader
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} sort Property key of the model to sort by
 */
  .directive('mwListableHeaderBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        property: '@sort'
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/templates/mwListableBb/mwListableHeader.html',
      link: function (scope, elm, attr, mwListableCtrl) {
        var ascending = '+',
          descending = '-';

        scope.toggleSortOrder = function () {
          if (scope.property) {
            var sortOrder = ascending; //default
            if (mwListableCtrl.getSortOrder() === ascending + scope.property) {
              sortOrder = descending;
            }
            mwListableCtrl.sort(scope.property, sortOrder);
          }
        };

        scope.isSelected = function (prefix) {
          if (prefix) {
            return mwListableCtrl.getSortOrder() === prefix + scope.property;
          } else {
            return (mwListableCtrl.getSortOrder() === '+' + scope.property || mwListableCtrl.getSortOrder() === '-' + scope.property);
          }
        };

        if (scope.property) {
          elm.find('.title').on('click', scope.toggleSortOrder);
        }

        mwListableCtrl.registerColumn(scope);

        scope.$on('$destroy', function () {
          mwListableCtrl.unRegisterColumn(scope);
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableColumnCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select item' checkbox in content.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
  .directive('mwListableColumnCheckboxBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        item: '='
      },
      templateUrl: 'uikit/templates/mwListableBb/mwListableColumnCheckbox.html',
      link: function (scope, elm, attr, mwListableCtrl) {
        scope.isSingleSelection = mwListableCtrl.isSingleSelection();
        scope.click = function (item, $event) {
          $event.stopPropagation();
          if (item.selectable) {
            item.selectable.toggleSelect();
          }
        };

        scope.$watch('item.selectable.isDisabled()', function (isDisabled) {
          if (isDisabled) {
            scope.item.selectable.unSelect();
          }
        });
      }
    };
  })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header.
 *
 * @scope
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
  .directive('mwListableHeaderCheckboxBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: true,
      templateUrl: 'uikit/templates/mwListableBb/mwListableHeaderCheckbox.html',
      link: function (scope, elm, attr, mwListableCtrl) {
        scope.isSingleSelection = mwListableCtrl.isSingleSelection();
        scope.collection = mwListableCtrl.getCollection();
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableRow
 * @element tr
 * @description
 *
 * Directive for table row. Adds click actions. And class 'selected' if row is selected.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
  .directive('mwListableBodyRowBb', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      compile: function (elm) {

        elm.prepend('<td  ng-if="collection.selectable && item.selectable" mw-listable-column-checkbox-bb item="item"></td>');

        return function (scope, elm, attr, ctrl) {
          var selectedClass = 'selected';

          scope.collection = ctrl.getCollection();

          if (!scope.item) {
            throw new Error('No item available in the list! Please make sure to use ng-repeat="item in collection"');
          }

          if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
            elm.addClass('selectable clickable');
          } else if (ctrl.actionColumns && ctrl.actionColumns.length > 0) {
            elm.addClass('clickable');
          }

          elm.on('click', function () {
            if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
              $timeout(function () {
                scope.item.selectable.toggleSelect();
              });
            }
          });

          elm.on('dblclick', function () {
            if (ctrl.actionColumns && angular.isNumber(scope.$index) && ctrl.actionColumns[scope.$index]) {
              document.location.href = ctrl.actionColumns[scope.$index];
            }
          });

          scope.$watch('item.selectable.isSelected()', function (value) {
            if (value) {
              elm.addClass(selectedClass);
            } else {
              elm.removeClass(selectedClass);
            }
          });
        };
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderRow
 * @element tr
 * @description
 *
 * Directive for table header row. Adds mw-listable-header-checkbox if selectable is present and th tags for actionColumns.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
  .directive('mwListableHeaderRowBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: true,
      compile: function (elm) {
        elm.prepend('<th ng-if="hasCollection" width="1%"></th>');
        elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

        return function (scope, elm, attr, mwListableCtrl) {
          //empty collection is [] so ng-if would not work as expected
          //we also have to check if the collection has a selectable
          scope.hasCollection = false;
          var collection = mwListableCtrl.getCollection();
          if (collection) {
            scope.hasCollection = angular.isDefined(collection.length) && collection.selectable;
          }
          scope.actionColumns = mwListableCtrl.actionColumns;
        };
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkShow
 * @element td
 * @description
 *
 * Directive to add a button link to show a dataset.
 *
 * @param {string} mwListableLinkShow URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
  .directive('mwListableLinkShowBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        link: '@mwListableLinkShowBb'
      },
      template: '<span mw-link-show="{{link}}"></span>',
      link: function (scope, elm, attr, mwListableCtrl) {
        mwListableCtrl.actionColumns.push(scope.link);
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwRowIdentifier
 * @description
 *
 * Directive that adds title attribute to th and td elements. Used to hide columns in css for special branding
 *
 * @param {string} mwRowIdentifier the title to be used
 *
 */
  .directive('mwRowIdentifierBb', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (attr.mwRowIdentifier) {
          attr.$set('title', attr.mwRowIdentifier);
        }
      }
    };
  })

  .directive('mwListableHead2', ['$window', 'i18n', 'MCAPCollection', function ($window, i18n, MCAPCollection) {
    return {
      scope: {
        collection: '=',
        affixOffset: '=',
        collectionName: '@',
        nameFn: '&',
        nameAttribute: '@',
        localizeName: '@',
        nameI18nPrefix: '@',
        nameI18nSuffix: '@'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwListableBb/mwListableHead.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        var scrollEl,
          bodyEl = angular.element('body'),
          modalEl = el.parents('.modal .modal-body'),
          lastScrollYPos = 0,
          canShowSelected = false,
          affixOffset = scope.affixOffset,
          isSticked = false;

        scope.selectable = false;
        scope.selectedAmount = 0;
        scope.collectionName = scope.collectionName || i18n.get('common.items');
        scope.isModal = modalEl.length>0;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;

        var throttledScrollFn = _.throttle(function () {

          var currentScrollPos = scrollEl.scrollTop();

          if (currentScrollPos > affixOffset) {
            if (currentScrollPos < lastScrollYPos) {
              var newTopVal = currentScrollPos - affixOffset;
              newTopVal = newTopVal<0?0:newTopVal;
              el.css('top', newTopVal);
              el.css('opacity', 1);
              isSticked = true;
            } else {
              el.css('opacity', 0);
              el.css('top', 0);
              isSticked = false;
            }
          } else {
            el.css('top', 0);
            el.css('opacity', 1);
            isSticked = false;
          }

          lastScrollYPos = currentScrollPos;
        },10);

        var loadItemsNotInCollection = function(){
          if(scope.hasFetchedModelsNotInCollection){
            return;
          }
          var selectedNotInCollection = [];
          scope.selectable.getSelected().each(function(model){
            if(!model.selectable.isInCollection && !scope.getModelAttribute(model)){
              selectedNotInCollection.push(model);
            }
          });

          if(selectedNotInCollection.length === 0){
            return;
          }

          var Collection = scope.collection.constructor.extend({
            filterableOptions: function(){
              return {
                filterDefinition: function () {
                  var filter = new window.mCAP.Filter(),
                    filters = [];

                  selectedNotInCollection.forEach(function(model){
                    if(model.id){
                      filters.push(
                        filter.string(model.idAttribute, model.id)
                      );
                    }
                  });

                  return filter.or(filters);
                }
              };
            }
          });
          var collection = new Collection();
          collection.url = scope.collection.url();

          scope.isLoadingModelsNotInCollection = true;

          collection.fetch().then(function(collection){
            scope.hasFetchedModelsNotInCollection = true;
            var selected = scope.selectable.getSelected();
            collection.each(function(model){
              selected.get(model.id).set(model.toJSON());
            });

            var deletedUuids = _.difference(_.pluck(selectedNotInCollection,'id'), collection.pluck('uuid'));

            deletedUuids.forEach(function(id){
              selected.get(id).selectable.isDeletedItem = true;
            });

            scope.isLoadingModelsNotInCollection = false;
          });
        };

        scope.showSelected = function(){
          canShowSelected = true;
          loadItemsNotInCollection();
          setTimeout(function(){
            var height;
            if(scope.isModal){
              height = modalEl.height() + (modalEl.offset().top - el.find('.selected-items').offset().top) + 25;
              modalEl.css('overflow', 'hidden');
            } else {
              height = angular.element($window).height()-el.find('.selected-items').offset().top + scrollEl.scrollTop() - 25;
              bodyEl.css('overflow', 'hidden');
            }

            el.find('.selected-items').css('height',height);
            el.find('.selected-items').css('bottom',height*-1);
          });
        };

        scope.hideSelected = function(){
          if(scope.isModal){
            modalEl.css('overflow', 'auto');
          } else {
            bodyEl.css('overflow', 'inherit');
          }
          canShowSelected = false;
        };

        scope.canShowSelected = function(){
          return scope.selectable && canShowSelected && scope.selectedAmount>0;
        };

        scope.unSelect = function(model){
          model.selectable.unSelect();
        };

        scope.toggleSelectAll = function(){
          scope.selectable.toggleSelectAll();
        };

        scope.getTotalAmount = function(){
          if(scope.collection.filterable && scope.collection.filterable.getTotalAmount()){
            return scope.collection.filterable.getTotalAmount();
          } else {
            return scope.collection.length;
          }
        };

        scope.toggleShowSelected = function(){
          if( canShowSelected ){
            scope.hideSelected();
          } else {
            scope.showSelected();
          }
        };

        scope.getModelAttribute = function(model){
          if(scope.nameAttribute){
            var modelAttr = model.get(scope.nameAttribute);

            if(scope.nameI18nPrefix || scope.nameI18nSuffix){
              var i18nPrefix = scope.nameI18nPrefix || '',
                  i18nSuffix = scope.nameI18nSuffix || '';

              return i18n.get(i18nPrefix + '.' + modelAttr + '.' + i18nSuffix);
            } else if(angular.isDefined(scope.localizeName)){
              return i18n.localize(modelAttr);
            } else {
              return modelAttr;
            }
          } else {
            return scope.nameFn({item: model});
          }
        };

        var init = function(){
          scope.selectable = scope.collection.selectable;
          if (scope.isModal) {
            //element in modal
            scrollEl = modalEl;
          }
          else {
            //element in window
            scrollEl = angular.element($window);
          }

          if(!affixOffset){
            if(scope.isModal){
              affixOffset = 73;
            } else {
              affixOffset = 35;
            }
          }

          // Register scroll callback
          scrollEl.on('scroll', throttledScrollFn);

          // Deregister scroll callback if scope is destroyed
          scope.$on('$destroy', function () {
            scrollEl.off('scroll', throttledScrollFn);
          });

        };

        $transclude(function (clone) {
          if (clone && clone.length > 0) {
            el.addClass('has-extra-content');
          }
        });

        scope.$watch(function(){
          if(scope.selectable){
            return scope.selectable.getSelected().length;
          } else {
            return 0;
          }
        }, function(val){
          scope.selectedAmount = val;
          if(val < 1){
            scope.hideSelected();
          }
        });

        scope.$watch('collection', function(collection){
          if(collection && collection instanceof MCAPCollection){
            init();
          }
        });
      }
    };
  }])
;

'use strict';

angular.module('mwMap', [])

/**
 * @ngdoc directive
 * @name mwWizard.directive:mwWizard
 * @element div
 * @description
 *
 * Multiple wizard steps can be transcluded into this directive. This Directive handles the
 * registration of every single wizard step
 *
 * @param {wizard} mw-wizard Wizard instance created by the Wizard service.
 */
  .directive('mwMap', function () {
    return {
      restrict: 'A',
      scope: {
        centerLat: '=',
        centerLng: '=',
        zoom: '=',
        type:'@'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwMap/mwMap.html',
      controller: ['$window', '$scope', 'LayoutWatcher', function ($window,$scope, LayoutWatcher) {
        if(!$window.ol){
          throw new Error('The directive mwMap needs the Openlayer 3 library. Make sure you included it!');
        }

        var openlayer = this.openlayer = $window.ol;


        var centerCoords = [$scope.lng || 9.178977, $scope.lat || 48.812951],
            zoom = $scope.zoom || 1,
            type = $scope.type || 'osm';

        var centerMap = function(){
          if($scope.centerLat && $scope.centerLng){
            $scope.map.getView().setCenter(openlayer.proj.transform([$scope.centerLng,$scope.centerLat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        var resize = function(){
          $scope.map.updateSize();
        };

        $scope.map = this.map = new openlayer.Map({
          layers: [
            new openlayer.layer.Tile({
              source: new openlayer.source.MapQuest({layer: type,minZoom:6})
            })
          ],
          ol3Logo:false,
          view: new openlayer.View({
            center: openlayer.proj.transform(centerCoords, 'EPSG:4326', 'EPSG:3857'),
            zoom: zoom,
            minZoom: 6
          })
        });

        $scope.$watch('zoom',function(value) {
          if (value) {
            $scope.map.getView().setZoom(value);
          }
        });

        $scope.$watch('centerLat',centerMap);
        $scope.$watch('centerLng',centerMap);

        LayoutWatcher.registerCallback(resize);

        $scope.$on('$destroy',function(){
          $scope.map.removeLayer();
          $scope.map.removeOverlay();
        });
      }],
      link:function(scope,el){
        scope.map.setTarget(el.find('#map')[0]);
      }
    };
  })

  .directive('mwMapMarker', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '='
      },
      require: '^mwMap',
      template: '<div class="marker"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
            openlayer = mwMapCtrl.openlayer,
            coords = [scope.lng || 0, scope.lat || 0];

        var marker = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el[0],
          stopEvent: false
        });

        var setPosition = function(){
          if(scope.lat && scope.lng){
            marker.setPosition(openlayer.proj.transform([scope.lng, scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        map.addOverlay(marker);

        scope.$watch('lat',setPosition);
        scope.$watch('lng',setPosition);

        scope.$on('$destroy',function(){
          map.removeOverlay(marker);
        });
      }
    };
  })

  .directive('mwMapOverlay', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        display: '='
      },
      transclude: true,
      require: '^mwMap',
      template: '<div ng-transclude class="overlay mw-map-overlay"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = [scope.lng || 0, scope.lat || 0];

        var overlay = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el.find('.mw-map-overlay')[0],
          stopEvent: false
        });

        var setPosition = function(){
          if(scope.lat && scope.lng){
            overlay.setPosition(openlayer.proj.transform([scope.lng, scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        map.addOverlay(overlay);

        scope.$watch('lat',setPosition);
        scope.$watch('lng',setPosition);

        scope.$watch('display',function(display){
          if(display){
            map.addOverlay(overlay);
            setPosition();
          } else {
            map.removeOverlay(overlay);
          }
        });

        scope.$on('$destroy',function(){
          map.removeOverlay(overlay);
        });
      }
    };
  })

  .directive('mwMapCircle', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        radius: '=',
        fill: '@',
        stroke: '@',
        strokeWidth: '@'
      },
      require: '^mwMap',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = [scope.lng || 0, scope.lat || 0],
          radius = scope.radius || 1000,
          fill = scope.fill || 'rgba(255, 255, 255, .5)',
          stroke = scope.stroke || '#fff',
          strokeWidth = scope.strokeWidth || 3;

        map.on('postcompose', function(evt) {
          evt.vectorContext.setFillStrokeStyle(
            new openlayer.style.Fill({color: fill}),
            new openlayer.style.Stroke({color: stroke, width: strokeWidth}));
          evt.vectorContext.drawCircleGeometry(
            new openlayer.geom.Circle(openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'), radius));
        });
      }
    };
  });


'use strict';

angular.module('mwModal', [])

/**
 *
 * @ngdoc object
 * @name mwModal.Modal
 * @description The Modal service is used to manage Bootstrap modals.
 * @example
 * <doc:example>
 *   <doc:source>
 *     <script>
 *       function Controller($scope, Modal) {
 *        var modal = Modal.create({
 *          templateUrl: 'myModal.html',
 *          scope: $scope,
 *          controller: function() {
 *            // do something on initialization
 *          }
 *        });
 *        $scope.onClick = function() {
 *          Modal.show(modal)
 *        }
 *       }
 *     </script>
 *   </doc:source>
 * </doc:example>
 */
  .service('Modal', ['$rootScope', '$templateCache', '$document', '$compile', '$controller', '$q', '$templateRequest', '$timeout', 'Toast', function ($rootScope, $templateCache, $document, $compile, $controller, $q, $templateRequest, $timeout, Toast) {

    var _body = $document.find('body').eq(0),
      _openedModals = [];

    var Modal = function (modalOptions, bootStrapModalOptions) {

      var _id = modalOptions.templateUrl,
        _scope = modalOptions.scope || $rootScope,
        _scopeAttributes = modalOptions.scopeAttributes || {},
        _controller = modalOptions.controller,
        _class = modalOptions.class || '',
        _holderEl = modalOptions.el ? modalOptions.el : 'body .module-page',
        _bootStrapModalOptions = bootStrapModalOptions || {},
        _modalOpened = false,
        _self = this,
        _modal,
        _usedScope,
        _bootstrapModal;

      var _getTemplate = function () {
        if (!_id) {
          throw new Error('Modal service: templateUrl options is required.');
        }
        return $templateRequest(_id);
      };

      var _bindModalCloseEvent = function () {
        _bootstrapModal.on('hidden.bs.modal', function () {
          _self.destroy();
        });
      };

      var _destroyOnRouteChange = function () {
        var changeLocationOff = $rootScope.$on('$locationChangeStart', function (ev, newUrl) {
          if (_bootstrapModal && _modalOpened) {
            ev.preventDefault();
            _self.hide().then(function () {
              document.location.href = newUrl;
              changeLocationOff();
            });
          } else {
            changeLocationOff();
          }
        });
      };

      var _buildModal = function () {
        var dfd = $q.defer();

        _usedScope = _scope.$new();

        _.extend(_usedScope, _scopeAttributes);

        if (_controller) {
          $controller(_controller, {$scope: _usedScope, modalId: _id});
        }

        _scope.hideModal = function () {
          return _self.hide();
        };

        _getTemplate().then(function (template) {
          _modal = $compile(template.trim())(_usedScope);
          _usedScope.$on('COMPILE:FINISHED', function () {
            _modal.addClass('mw-modal');
            _modal.addClass(_class);
            _bootstrapModal = _modal.find('.modal');
            _bootStrapModalOptions.show = false;
            _bootstrapModal.modal(_bootStrapModalOptions);

            // We need to overwrite the the original backdrop method with our own one
            // to make it possible to define the element where the backdrop should be placed
            // This enables us a backdrop per modal because we are appending the backdrop to the modal
            // When opening multiple modals the previous will be covered by the backdrop of the latest opened modal
            /* jshint ignore:start */
            _bootstrapModal.data()['bs.modal'].backdrop = function (callback) {
              $bootstrapBackdrop.call(_bootstrapModal.data()['bs.modal'], callback, $(_holderEl).find('.modal'));
            };
            /* jshint ignore:end */

            _bindModalCloseEvent();
            _destroyOnRouteChange();
            dfd.resolve();
          });
        });

        return dfd.promise;
      };

      this.id = _id;

      this.getScope = function () {
        return _scope;
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#show
       * @methodOf mwModal.Modal
       * @function
       * @description Shows the modal
       */
      this.show = function () {
        _body.css({
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        });
        Toast.clear();
        _buildModal().then(function () {
          angular.element(_holderEl).append(_modal);
          _bootstrapModal.modal('show');
          _modalOpened = true;
          _openedModals.push(this);
        }.bind(this));
      };


      this.setScopeAttributes = function (obj) {
        if (_.isObject(obj)) {
          _.extend(_scopeAttributes, obj);
        }
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#hide
       * @methodOf mwModal.Modal
       * @function
       * @description Hides the modal
       * @returns {Object} Promise which will be resolved when modal is successfully closed
       */
      this.hide = function () {
        var dfd = $q.defer();
        if (_bootstrapModal && _modalOpened) {
          _bootstrapModal.one('hidden.bs.modal', function () {
            _bootstrapModal.off();
            _self.destroy();
            _modalOpened = false;
            dfd.resolve();
          });
          _bootstrapModal.modal('hide');
        } else {
          dfd.resolve();
        }

        return dfd.promise;
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#toggle
       * @methodOf mwModal.Modal
       * @function
       * @description Toggles the modal
       * @param {String} modalId Modal identifier
       */
      this.toggle = function () {
        _bootstrapModal.modal('toggle');
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#destroy
       * @methodOf mwModal.Modal
       * @function
       * @description Removes the modal from the dom
       */
      this.destroy = function () {
        _openedModals = _.without(_openedModals, this);
        var toasts = Toast.getToasts();
        toasts.forEach(function(toast){
          if(+new Date()-toast.initDate>500){
            Toast.removeToast(toast.id);
          }
        });

        $timeout(function () {
          _body.css({
            height: '',
            width: '',
            overflow: ''
          });
          if (_modal) {
            _modal.remove();
            _modalOpened = false;
          }

          if (_usedScope) {
            _usedScope.$destroy();
          }
        }.bind(this));
      };

      (function main() {

        _getTemplate();

        _scope.$on('$destroy', function () {
          _self.hide();
        });

      })();

    };

    /**
     *
     * @ngdoc function
     * @name mwModal.Modal#create
     * @methodOf mwModal.Modal
     * @function
     * @description Create and initialize the modal element in the DOM. Available options
     *
     * - **templateUrl**: URL to a template (_required_)
     * - **scope**: scope that should be available in the controller
     * - **controller**: controller instance for the modal
     *
     * @param {Object} modalOptions The options of the modal which are used to instantiate it
     * @returns {Object} Modal
     */
    this.create = function (modalOptions) {
      return new Modal(modalOptions);
    };

    this.prepare = function (modalOptions, bootstrapModalOptions) {
      var ModalDefinition = function () {
        return new Modal(modalOptions, bootstrapModalOptions);
      };
      return ModalDefinition;
    };

    this.getOpenedModals = function () {
      return _openedModals;
    };
  }])

  .provider('mwModalTmpl', function () {

    var _logoPath;

    this.setLogoPath = function (path) {
      _logoPath = path;
    };

    this.$get = function () {
      return {
        getLogoPath: function () {
          return _logoPath;
        }
      };
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModal
 * @element div
 * @description
 * Shortcut directive for Bootstraps modal.
 *
 * @scope
 *
 * @param {string} title Modal title
 * @example
 * <doc:example>
 *   <doc:source>
 *     <div mw-modal title="My modal">
 *       <div mw-modal-body>
 *         <p>One fine body&hellip;</p>
 *       </div>
 *       <div mw-modal-footer>
 *         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
 *         <button type="button" class="btn btn-primary">Save changes</button>
 *       </div>
 *     </div>
 *   </doc:source>
 * </doc:example>
 */

  .directive('mwModal', ['mwModalTmpl', function (mwModalTmpl) {
    return {
      restrict: 'A',
      scope: {
        title: '@'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwModal/mwModal.html',
      link: function (scope) {
        scope.$emit('COMPILE:FINISHED');
        scope.mwModalTmpl = mwModalTmpl;
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalBody
 * @element div
 * @description
 * Shortcut directive for Bootstraps body. See {@link mwModal.directive:mwModal `mwModal`} for more information
 * about mwModal.
 */
  .directive('mwModalBody', function () {
    return {
      restrict: 'A',
      transclude: true,
      replace: true,
      template: '<div class="modal-body clearfix" ng-transclude></div>'
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalFooter
 * @element div
 * @description
 * Shortcut directive for Bootstraps footer. See {@link mwModal.directive:mwModal `mwModal`} for more information
 * about mwModal.
 */
  .directive('mwModalFooter', function () {
    return {
      restrict: 'A',
      transclude: true,
      replace: true,
      template: '<div class="modal-footer" ng-transclude></div>'
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalOnEnter
 * @element button
 * @description
 * Adds ability to trigger button with enter key. Checks validation if button is part of a form.
 */
  .directive('mwModalOnEnter', function () {
    return {
      restrict: 'A',
      require: '?^form',
      link: function (scope, elm, attr, ctrl) {
        elm.parents('.modal').first().on('keyup', function (event) {
          if (event.keyCode === 13 && event.target.nodeName !== 'SELECT') {
            if ((ctrl && ctrl.$valid) || !ctrl) {
              elm.click();
            }
          }
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalConfirm
 * @element div
 * @description
 *
 * Opens a simple confirm modal.
 *
 * @scope
 *
 * @param {expression} ok Expression to evaluate on click on 'ok' button
 * @param {expression} cancel Expression to evaluate on click on 'cancel' button
 */
  .directive('mwModalConfirm', function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: true,
      templateUrl: 'uikit/templates/mwModal/mwModalConfirm.html',
      link: function (scope, elm, attr) {
        angular.forEach(['ok', 'cancel'], function (action) {
          scope[action] = function () {
            scope.$eval(attr[action]);
          };
        });

      }
    };
  });

/* jshint ignore:start */
// This is the orginal bootstrap backdrop implementation with the only
// modification that the element can be defined as parameter where the backdrop should be placed
var $bootstrapBackdrop = function (callback, holderEl) {
  var animate = this.$element.hasClass('fade') ? 'fade' : '';

  if (this.isShown && this.options.backdrop) {
    var doAnimate = $.support.transition && animate;

    this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
      .appendTo(holderEl);

    this.$backdrop.on('click', $.proxy(function (e) {
      if (e.target !== e.currentTarget) {
        return;
      }
      this.options.backdrop == 'static'
        ? this.$element[0].focus.call(this.$element[0])
        : this.hide.call(this)
    }, this));

    if (doAnimate) {
      this.$backdrop[0].offsetWidth;
    } // force reflow

    this.$backdrop.addClass('in');

    if (!callback) return;

    doAnimate ?
      this.$backdrop
        .one($.support.transition.end, callback)
        .emulateTransitionEnd(150) :
      callback()

  } else if (!this.isShown && this.$backdrop) {
    this.$backdrop.removeClass('in');

    $.support.transition && this.$element.hasClass('fade') ?
      this.$backdrop
        .one($.support.transition.end, callback)
        .emulateTransitionEnd(150) :
      callback()

  } else if (callback) {
    callback()
  }
};
/* jshint ignore:end */

'use strict';

angular.module('mwNav', [])

    .directive('mwSubNav', function () {
      return {
        restrict: 'A',
        scope: {
          justified: '='
        },
        replace: true,
        transclude: true,
        template: '<div class="mw-nav"><ul class="nav nav-pills" ng-class="{\'nav-justified\':justified}" ng-transclude></ul></div>'
      };
    })

    .directive('mwSubNavPill', ['$location', function ($location) {
      return {
        restrict: 'A',
        scope: {
          url: '@mwSubNavPill',
          mwDisabled: '='
        },
        transclude: true,
        replace: true,
        template:
          '<li ng-class="{mwDisabled: mwDisabled}">' +
            '<div class="btn btn-link" ' +
                  'ng-click="navigate(url)" ' +
                  'ng-class="{disabled: mwDisabled}" ' +
                  'ng-transclude>' +
            '</div>' +
          '</li>',
        link: function (scope, elm) {
          var setActiveClassOnUrlMatch = function (url) {
            if (scope.url && url === scope.url.slice(1)) {
              elm.addClass('active');
            } else {
              elm.removeClass('active');
            }
          };

          scope.$watch('url', function (newUrlAttr) {
            if (newUrlAttr) {
              setActiveClassOnUrlMatch($location.$$path);
            }
          });

          scope.navigate = function(url){
            if(!scope.mwDisabled){
              url = url.replace(/#\//,'');
              $location.path(url);
              $location.replace();
            }
          };

          setActiveClassOnUrlMatch($location.$$path);

        }
      };
    }])

    .directive('mwNavbar', ['$location', function ($location) {
      return {
        transclude: true,
        replace: true,
        templateUrl: 'uikit/templates/mwNav/mwNavbar.html',
        controller: function () {
          this.isActive = function (path, exact) {
            if(!path) {
              return false;
            }
            var newPath = path.substring(1);
            if(exact){
              return $location.path() === newPath;
            }
            return $location.path().indexOf(newPath) > -1;
          };
        }
      };
    }])

    .directive('mwNavbarContent', function () {
      return {
        transclude: true,
        replace: true,
        template: '<div class="navbar-collapse collapse" ng-transclude></div>',
        link: function(scope, elm) {
          scope.uncollapse = function() {
            if(elm.hasClass('in')) {
              elm.collapse('hide');
            }
          };
        }
      };
    })

    .directive('mwNavbarBrand', function () {
      return {
        transclude: true,
        replace: true,
        templateUrl: 'uikit/templates/mwNav/mwNavbarBrand.html'
      };
    })

    .directive('mwNavbarItems', function () {
      return {
        transclude: true,
        replace: true,
        template: '<ul class="nav navbar-nav" ng-transclude></ul>',
        link: function (scope, elm, attr) {

          if(attr.mwNavbarItems) {
            elm.addClass('navbar-' + attr.mwNavbarItems);
          }

          elm.on('click', function () {
            if (elm.hasClass('in')) {
              elm.collapse('hide');
            }
          });
        }
      };
    })

    .directive('mwNavbarItem', ['$rootScope', function ($rootScope) {
      return {
        transclude: true,
        replace: true,
        scope: true,
        require: '^mwNavbar',
        template: '<li ng-class="{active: isActive}" ng-transclude></li>',
        link: function (scope, elm, attr, mwNavbarCtrl) {
          var isActive = function () {
            scope.isActive = mwNavbarCtrl.isActive(elm.find('a').attr('href'));
          };
          isActive();
          $rootScope.$on('$routeChangeSuccess', isActive);

          elm.find('a').on('click', function() {
            scope.uncollapse();
          });
        }
      };
    }])

    .directive('mwNavbarDropdown', ['$rootScope', function ($rootScope) {
      return {
        replace: true,
        require: '^mwNavbar',
        transclude: true,
        template: '<li ng-class="{active: isActive}" class="dropdown" ng-transclude></li>',
        link: function (scope, elm, attr, mwNavbarCtrl) {
          var isActive = function () {
            var active = false;
            angular.forEach(scope.dropdownItems, function (path) {
              if (!active) {
                active = mwNavbarCtrl.isActive(path);
              }
            });
            scope.isActive = active;
          };
          isActive();
          $rootScope.$on('$routeChangeSuccess', isActive);
        },
        controller: ['$scope', function ($scope) {
          var dropdownItems = $scope.dropdownItems = [];
          this.register = function (path) {
            dropdownItems.push(path);
          };
        }]
      };
    }])

    .directive('mwNavbarDropdownTitle', function () {
      return {
        replace: true,
        transclude: true,
        template: '<a class="dropdown-toggle" data-toggle="dropdown"><span ng-transclude></span> <b class="caret"></b></a>'
      };
    })

    .directive('mwNavbarDropdownItems', function () {
      return {
        transclude: true,
        replace: true,
        template: '<ul class="dropdown-menu" ng-transclude></ul>'
      };
    })


    .directive('mwNavbarDropdownItem', ['$rootScope', function ($rootScope) {
      return {
        transclude: true,
        replace: true,
        scope: true,
        require: ['^mwNavbarDropdown', '^mwNavbar'],
        template: '<li ng-class="{active: isActive}" ng-transclude></li>',
        link: function (scope, elm, attr, ctrls) {
          var link = elm.find('a').attr('href'),
              mwNavbarDropdownItemsCtrl = ctrls[0],
              mwNavbarCtrl = ctrls[1];

          if(mwNavbarDropdownItemsCtrl){
            mwNavbarDropdownItemsCtrl.register(link);
          }

          var isActive = function () {
            scope.isActive = mwNavbarCtrl ? mwNavbarCtrl.isActive(link, true) : false;
          };
          isActive();

          $rootScope.$on('$routeChangeSuccess', isActive);

          elm.find('a').on('click', function() {
            scope.uncollapse();
          });
        }
      };
    }])


;
'use strict';

angular.module('mwPopover', [])

/**
 * Helper service for internal use to communicate between popover directives
 */
  .service('Popover', function () {
    this.contents = [];
  })

/**
 * @ngdoc directive
 * @name Relution.Common.directive:mwPopoverContent
 * @element ANY
 *
 * @description
 * Provides content for a popup under the given key
 *
 * @param {String} mwPopoverContent ID where this content should be available
 *
 * @example
 <div mw-popover-content="anID">Content of the popover</div>
 */
  .directive('mwPopoverContent', ['$compile', 'Popover', function ($compile, Popover) {

    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.css('display', 'none');
        Popover.contents[attr.mwPopoverContent] = $compile(elm.html())(scope);
      }
    };
  }])


/**
 * @ngdoc directive
 * @name Relution.Common.directive:mwPopover
 * @element ANY
 *
 * @description
 * Adds a popover for the current element (see Bootstrap 3 component)
 *
 * @param {String} mwPopover ID of mw-popover-content
 * @param {String} popoverTrigger how tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.
 * @param {String} popoverPosition how to position the tooltip - top | bottom | left | right | auto. When "auto" is specified, it will dynamically reorient the tooltip. For example, if placement is "auto left", the tooltip will display to the left when possible, otherwise it will display right.
 *
 * @example
 <div mw-popover-button="Click me to open the popover">Content of the popover</div>
 */
  .directive('mwPopover', ['$rootScope', '$templateRequest', '$compile', function ($rootScope, $templateRequest, $compile) {
    return {
      restrict: 'A',
      link: function (scope, el, attr) {

        var visible = false,
          content = '';

        var buildPopover = function () {
          el.popover('destroy');
          el.popover({
            trigger: attr.popoverTrigger || 'hover',
            title: attr.popoverTitle,
            html: true,
            placement: attr.popoverPosition,
            content: $compile(content.trim())(scope)
          });

          el.on('show.bs.popover', function () {
            visible = true;
          });
        };

        el.on('blur', function () {
          el.popover('hide');
        });

        //we need to set a default value here, see
        //https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11
        attr.popoverTitle = attr.popoverTitle || 'popoverTitle';
        attr.$observe('popoverTitle', buildPopover);

        if (attr.popoverUrl) {
          content = '<span rln-spinner></span>';
          $templateRequest(attr.popoverUrl).then(function (template) {
            content = template;
            buildPopover();
          });
          buildPopover();
        }

        attr.$observe('content', function (val) {
          if (val) {
            content = val;
            buildPopover();
          }
        });

        scope.$on('$destroy', function () {
          var popover = el.data('bs.popover');
          if(popover && popover.tip()){
            popover.tip().detach().remove();
          }
        });
      }
    };
  }])

;
/**
 * Created by zarges on 23/06/15.
 */
'use strict';
angular.module('mwResponseHandler', [])

  .provider('ResponseHandler', function () {

    var _routeHandlersPerMethodContainer = {
        POST: [],
        PUT: [],
        GET: [],
        DELETE: [],
        PATCH: []
      };

    var _methodIsInValidError = function(method){
      return new Error('Method '+method+' is invalid. Valid methods are POST, PUT, GET, DELETE, PATCH');
    };

    var RouteHandler = function (route) {

      var _codes = {
          ERROR: [],
          SUCCESS: []
        },
        _route = route,
        _routeRegex = null,
        _optionalParam = /\((.*?)\)/g,
        _namedParam = /(\(\?)?:\w+/g,
        _splatParam = /\*\w?/g,
        _escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;


      var _routeToRegExp = function (route) {
        route = route.replace(_escapeRegExp, '\\$&')
          .replace(_optionalParam, '(?:$1)?')
          .replace(_namedParam, function (match, optional) {
            return optional ? match : '([^/?]+)';
          })
          .replace(_splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
      };

      var _registerCallbackForCode = function (code, callback) {

        var existingCallbacks = _codes[code],
          callbacks = existingCallbacks || [];

        callbacks.push(callback);

        _codes[code] = callbacks;
      };

      var _getCallbackForCode = function (code) {
        return _codes[code];
      };

      this.matchesUrl = function (url) {
        return url.match(_routeRegex);
      };

      this.registerCallbackForStatusCodes = function (statusCodes, callback) {
        statusCodes.forEach(function (statusCode) {
          _registerCallbackForCode(statusCode, callback);
        }, this);
      };

      this.registerCallbackForSuccess = function (callback) {
        _registerCallbackForCode('SUCCESS', callback);
      };

      this.registerCallbackForError = function (callback) {
        _registerCallbackForCode('ERROR', callback);
      };

      this.getCallbacksForStatusCode = function (statusCode) {
        return _getCallbackForCode(statusCode);
      };

      this.getCallbacksForSuccess = function () {
        return _getCallbackForCode('SUCCESS');
      };

      this.getCallbacksForError = function () {
        return _getCallbackForCode('ERROR');
      };

      var main = function () {
        _routeRegex = _routeToRegExp(_route);
      };

      main.call(this);
    };

    this.registerAction = function (route, callback, options) {
      options = options || {};

      if(!options.onError && !options.onSuccess && !options.statusCodes){
        throw new Error('You have to specify either some statusCodes or set onSuccess or onError to true in the options parameter object');
      }

      if (( options.onError && options.onSuccess ) || ( (options.onError || options.onSuccess) && options.statusCodes )) {
        throw new Error('Definition is too imprecise');
      }
      if (!options.method && !options.methods) {
        throw new Error('Method has to be defined in options e.g method: "POST" or methods:["POST"]');
      }

      options.methods = options.methods || [options.method];

      options.methods.forEach(function(method){

        if (!_routeHandlersPerMethodContainer[method]) {
          throw _methodIsInValidError(method);
        }

        var existingRouteHandlerContainer = _.findWhere(_routeHandlersPerMethodContainer[method], {id: route}),
          routeHandlerContainer = existingRouteHandlerContainer || {id: route, handler: new RouteHandler(route)},
          routeHandler = routeHandlerContainer.handler;

        if (options.statusCodes) {
          routeHandler.registerCallbackForStatusCodes(options.statusCodes, callback);
        } else if (options.onSuccess) {
          routeHandler.registerCallbackForSuccess(callback);
        } else if (options.onError) {
          routeHandler.registerCallbackForError(callback);
        }

        if (!existingRouteHandlerContainer) {
          _routeHandlersPerMethodContainer[method].push(routeHandlerContainer);
        }

      });
    };

    this.registerSuccessAction = function (route, callback, method) {
      return this.registerAction(route, callback, {
        method: method,
        onSuccess: true
      });
    };

    this.registerErrorAction = function (route, callback, method) {
      return this.registerAction(route, callback, {
        method: method,
        onError: true
      });
    };

    this.registerDefaultAction = function(callback, options){
      options = options || {};
      return this.registerAction('*', callback, options);
    };

    this.registerDefaultSuccessAction = function (callback, method) {
      return this.registerAction('*', callback, {
        method: method,
        onSuccess: true
      });
    };

    this.registerDefaultErrorAction = function (callback, method) {
      return this.registerAction('*', callback, {
        method: method,
        onError: true
      });
    };

    this.$get = ['$injector', '$q', function ($injector, $q) {

      /*
       *  Execute promises sequentially
       *  When funtion does not return a promise it converts the response into a promise
       *  The last function defines if the chain should be resolved or rejected by rejecting or resolving value
       *  When the first function rejectes value but the last function resolves it the whole chain will be resolved
       */
      var _executePromiseQueue = function(fns, resp, isError, dfd){
        var fn = fns.shift();

        if(!dfd){
          dfd = $q.defer();
        }

        if(fn){
          var returnVal = fn(resp, isError),
              promise;
          if(returnVal && returnVal.then){
            promise = returnVal;
          } else {
            if(isError){
              promise = $q.reject(returnVal || resp);
            } else {
              promise = $q.when(returnVal || resp);
            }
          }

          promise.then(function(rsp){
            _executePromiseQueue(fns, rsp, false, dfd);
          },function(rsp){
            _executePromiseQueue(fns, rsp, true, dfd);
          });
        } else {
          if(isError){
            dfd.reject(resp);
          } else {
            dfd.resolve(resp);
          }
        }
        return dfd.promise;
      };

      var _executeCallbacks = function (callbacks, response, isError) {
        var fns = [];
        callbacks.forEach(function (callback) {
          callback = angular.isString(callback) ? $injector.get(callback) : callback;
          fns.push(callback);
        }, this);
        return _executePromiseQueue(fns, response, isError);
      };

      var _getCallbacks = function(handler, statusCode, isError){
        var statusCallbacks = handler.getCallbacksForStatusCode(statusCode),
            successCallbacks = handler.getCallbacksForSuccess(),
            errorCallbacks = handler.getCallbacksForError();

        if(statusCallbacks){
          return statusCallbacks;
        } else if(isError){
          return errorCallbacks;
        } else {
          return successCallbacks;
        }
      };

      return {
        getHandlerForUrlAndCode: function (method, url, statusCode, isError) {
          var _returnHandler;

          if (!_routeHandlersPerMethodContainer[method]) {
            throw _methodIsInValidError(method);
          }

          _routeHandlersPerMethodContainer[method].forEach(function (routeHandlerContainer) {
            var handler = routeHandlerContainer.handler,
                callbacks = _getCallbacks(handler, statusCode, isError);
            if (!_returnHandler && handler.matchesUrl(url) && callbacks && callbacks.length>0) {
              _returnHandler = handler;
            }
          });

          return _returnHandler;
        },
        handle: function (response, isError) {
          var url = response.config.url,
            method = response.config.method,
            statusCode = response.status,
            handler = this.getHandlerForUrlAndCode(method, url, statusCode, isError);

          if (handler) {
            var callbacks = _getCallbacks(handler, statusCode, isError);
            if(callbacks){
              return _executeCallbacks(callbacks, response, isError);
            }
          }
        }
      };
    }];
  })

  .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

    $provide.factory('requestInterceptorForHandling', ['$q', 'ResponseHandler', function ($q, ResponseHandler) {

      var handle = function(response, isError){
        var handler = ResponseHandler.handle(response, isError);
        if(handler){
          return handler;
        } else if(isError){
          return $q.reject(response);
        } else {
          return $q.when(response);
        }
      };

      return {
        response: function (response) {
          return handle(response, false);
        },
        responseError: function (response) {
          return handle(response, true);
        }
      };
    }]);

    $httpProvider.interceptors.push('requestInterceptorForHandling');

  }]);

/**
 * Created by zarges on 23/06/15.
 */
'use strict';
angular.module('mwResponseToastHandler', ['mwResponseHandler', 'mwI18n', 'mwToast'])

  .provider('ResponseToastHandler', ['$provide', 'ResponseHandlerProvider', function ($provide, ResponseHandlerProvider) {
    var _registeredIds = [],
      _registeredToastOptions = {
        DEFAULT: {
          type: 'default',
          autoHide: false
        }
      };

    var _getNotificationCallback = function (messages, id, options) {
      options = options || {};
      var factoryName = _.uniqueId('notification_factory');
      $provide.factory(factoryName, ['Toast', 'i18n', function (Toast, i18n) {
        return function ($httpResponse) {
          if(!messages){
            return;
          }

          var prevToast = Toast.findToast(id),
            data = {},
            messageStr = prevToast ? messages.plural : messages.singular,
            message,
            toastOptions = {
              id: id
            };

          if (!!prevToast && messages.plural) {
            messageStr = messages.plural;
          } else if (messages.singular) {
            messageStr = messages.singular;
          }

          data.$count = prevToast ? prevToast.replaceCount + 1 : 0;
          data.$count++;

          if (options.preProcess && typeof options.preProcess === 'function') {
            _.extend(data, $httpResponse.data);
            message = options.preProcess.call(this, messageStr, data, i18n, $httpResponse);
            if(!message){
              return;
            }
          } else {
            var resp = $httpResponse.data || {};

            if (resp.results && !_.isObject(resp.results)) {
              data = {message: resp.results};
            } else if (resp.results && resp.results.length > 0) {
              _.extend(data, resp.results[0]);
            }

            if ($httpResponse.config.instance && typeof $httpResponse.config.instance.toJSON === 'function') {
              var json = $httpResponse.config.instance.toJSON();
              _.extend(json, data);
              data = json;
            }

            message = i18n.get(messageStr, data);
          }

          if (options.toastType) {
            var opts = _registeredToastOptions[options.toastType];
            if (opts) {
              _.extend(toastOptions, opts);
            } else {
              throw new Error('Type ' + options.toastType + ' is not available. Make sure you have configured it first');
            }
          } else {
            _.extend(toastOptions, _registeredToastOptions.DEFAULT);
          }

          Toast.addToast(message, toastOptions);
        };
      }]);
      return factoryName;
    };

    this.registerToastType = function (typeId, toastOptions) {
      if (_registeredToastOptions[typeId]) {
        throw new Error('The toast type ' + typeId + ' is already defined. You can configure a toast type only once');
      } else {
        _registeredToastOptions[typeId] = toastOptions;
      }
    };

    this.registerToast = function (route, messages, options) {
      options = options || {};
      var codes = options.statusCodes || [options.onSuccess ? 'SUCCESS' : 'ERROR'];

      if (_.isUndefined(messages) || _.isObject(messages) && !messages.singular) {
        throw new Error('You have to pass a messages object and define at least the singular message {singular:"Mandatory", plural:"Optional"}');
      }

      codes.forEach(function (code) {
        var msgId = options.id || route + '_' + options.method + '_' + code,
          callbackFactory = _getNotificationCallback(messages, msgId, options);

        if (_registeredIds.indexOf(msgId) > -1) {
          throw new Error('You can not define a second message for the route ' + route + ' and method ' + options.method + ' because you have already registered one!');
        } else {
          if(code==='SUCCESS' || code ==='ERROR'){
            delete options.statusCodes;
          } else {
            options.statusCodes = [code];
          }
          ResponseHandlerProvider.registerAction(route, callbackFactory, options);
          _registeredIds.push(msgId);
        }
      });

    };

    this.registerSuccessToast = function (route, messages, method, toastType, preProcessFn) {
      this.registerToast(route, messages, {
        method: method,
        toastType: toastType,
        onSuccess: true,
        preProcess: preProcessFn
      });
    };

    this.registerErrorToast = function (route, messages, method, toastType, preProcessFn) {
      this.registerToast(route, messages, {
        method: method,
        toastType: toastType,
        onError: true,
        preProcess: preProcessFn
      });
    };

    this.registerDefaultSuccessToast = function (messages, method, toastType, preProcessFn) {
      return this.registerToast('*', messages, {
        method: method,
        toastType: toastType,
        onSuccess: true,
        preProcess: preProcessFn
      });
    };

    this.registerDefaultErrorToast = function (messages, method, toastType, preProcessFn) {
      return this.registerToast('*', messages, {
        method: method,
        toastType: toastType,
        onError: true,
        preProcess: preProcessFn
      });
    };

    this.$get = function () {
    };

  }]);
'use strict';

angular.module('mwSidebar', [])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarSelect
 * @element div
 * @description
 *
 * Creates a select input which provides possible values for a filtering.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
  .directive('mwSidebarSelect', function () {
    return {
      transclude: true,
      scope: {
        filterable: '=',
        mwDisabled: '=',
        property: '@',
        persist: '='
      },
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarSelect.html',
      link: function (scope) {
        scope.$watch('filterable', function () {
          if (scope.filterable) {
            scope.model = scope.filterable.properties[scope.property];
            if (scope.persist) {
              scope.filterable.properties[scope.property].persist = scope.persist;
            }
          }
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarPanel
 * @element div
 * @description
 *
 * Directive for the filter panel.
 *
 * @param {boolean} affix Make the filterbar affix by listening on window scroll event and changing top position so that the filterbar can be postion relative instead of fixed
 * @param {number} offset If needed an offset to the top for example when a nav bar is over the sidebar that is not fixed.
 *
 */
  .directive('mwSidebarPanel', ['$document', '$window', function ($document, $window) {
    return {
      replace: true,
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarPanel.html',
      link: function (scope, el, attr) {
        var offsetTop = angular.element(el).offset().top,
          newOffset;

        var repos = function () {
          offsetTop = angular.element(el).offset().top;

          if ($document.scrollTop() < attr.offset) {
            newOffset = offsetTop - $document.scrollTop();
          } else {
            newOffset = offsetTop - attr.offset;
          }

          angular.element(el).find('.content-container').css('top', newOffset);

          if ($document.scrollTop() < 1) {
            angular.element(el).find('.content-container').css('top', 'initial');
          }

        };

        var setMaxHeight = function () {
          var containerEl = el.find('.content-container'),
            windowHeight = angular.element(window).height(),
            containerElOffsetTop = el.offset().top,
            footerHeight = angular.element('body > footer').height(),
            padding = 20,
            maxHeight = windowHeight - containerElOffsetTop - footerHeight - padding;
            if(maxHeight>0){
              containerEl.css('max-height', maxHeight);
            } else {
              containerEl.css('max-height', 'initial');
            }
        };

        window.requestAnimFrame(setMaxHeight);
        setTimeout(setMaxHeight,500);
        angular.element($window).on('resize', _.throttle(setMaxHeight, 500));

        if (attr.affix && attr.offset) {
          angular.element($window).scroll(function () {
            repos();
          });
        }
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarActions
 * @element div
 * @description
 *
 * Container for actions
 *
 */
  .directive('mwSidebarActions', function () {
    return {
      transclude: true,
      template: '<div ng-transclude></div><hr>'
    };
  })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarFilters
 * @element div
 * @description
 *
 * Container for filters
 *
 */
  .directive('mwSidebarFilters', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarFilters.html',
      link: function (scope) {
        scope.resetFiltersOnClose = function () {
          if (!scope.toggleFilters) {
            scope.filterable.resetFilters();
            scope.filterable.applyFilters();
          }
        };

        if (scope.filterable && scope.filterable.hasPersistedFilters()) {
          scope.toggleFilters = true;
        }
      }
    };
  });



'use strict';

angular.module('mwSidebarBb', [])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarSelect
 * @element div
 * @description
 *
 * Creates a select input which provides possible values for a filtering.
 *
 * label: as default model.attributes.key will be used. If one of the following is specified it will be used. If two or more are specified the one which stands higher will be used:
 * - labelTransformFn
 * - labelProperty
 * - translationPrefix
 *
 * @param {collection} collection with option models. by default model.attributes.key will be called as key label
 * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 * @param {string} placeholder The name of the default selected label with an empty value.
 * @param {expression} persist If true, filter will be saved in runtime variable
 * @param {string} keyProperty property of model to use instead of models.attribute.key property
 * @param {string | object} labelProperty property of model to use instead of model.attributes.key poperty. If it is an object it will be translated with i18n service.
 * @param {function} labelTransformFn function to use. Will be called with model as parameter.
 * @param {string} translationPrefix prefix to translate the label with i18n service (prefix + '.' + model.attributes.key).
 */
  .directive('mwSidebarSelectBb', ['i18n', 'Persistance', 'EmptyState', function (i18n, Persistance, EmptyState) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        options: '=',
        placeholder: '@',
        mwDisabled: '=',
        keyProperty: '@',
        labelProperty: '@',
        labelTransformFn: '=',
        translationPrefix: '@',
        translationSuffix: '@',
        customUrlParameter: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarSelect.html',
      link: function (scope, elm, attr, ctrl) {

        //set key function for select key
        scope.key = function(model) {
          return model.attributes.key;
        };

        if(angular.isDefined(scope.keyProperty)) {
          scope.key = function(model) {
            return model.attributes[scope.keyProperty];
          };
        }

        //set label function fo select label
        scope.label = function(model){
          //translate with i18n service if translationPrefix is defined
          var label = scope.key(model);
          if(scope.translationPrefix && scope.translationSuffix){
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model) + '.'+scope.translationSuffix);
          } else if(scope.translationSuffix){
            label = i18n.get(scope.key(model)+'.'+scope.translationSuffix);
          } else if(scope.translationPrefix){
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model));
          }
          return label;
        };

        if(angular.isDefined(scope.labelProperty)){
          scope.label = function(model){
            //translate if value is a translation object
            if(angular.isObject(model.attributes[scope.labelProperty])){
              return i18n.localize(model.attributes[scope.labelProperty]);
            }
            return model.attributes[scope.labelProperty];
          };
        }

        if(angular.isDefined(scope.labelTransformFn)){
          scope.label = scope.labelTransformFn;
        }

        scope.collection = ctrl.getCollection();

        scope.changed = function(){
          //add property to setted filters on collection for empty state
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          EmptyState.pushFilter(scope.collection, property);

          //persist filter values
          Persistance.saveFilterValues(scope.collection);

          //fetch data and reset filtered property for this selectbox if the filter value or customUrlParameter is empty
          var searchValue = scope.customUrlParameter ? scope.collection.filterable.customUrlParams[scope.customUrlParameter] : scope.collection.filterable.filterValues[scope.property];
          scope.collection.fetch().then(function(collection){
            if(!searchValue){
              EmptyState.removeFilter(collection, property);
            }
          });
        };
      }
    };
  }])


/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarNumberInputBb
 * @element div
 * @description
 *
 * Creates a number input to filter for integer values.
 *
 * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 * @param {string} placeholder The name of the default selected label with an empty value.
 * @param {expression} persist If true, filter will be saved in runtime variable
 * @param {string} customUrlParameter If set, the filter will be set as a custom url parameter in the collection's filterable
 */

  .directive('mwSidebarNumberInputBb', ['Persistance', 'EmptyState', function (Persistance, EmptyState) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        placeholder: '@',
        mwDisabled: '=',
        customUrlParameter: '@',
        min: '@',
        max: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarNumberInput.html',
      link: function (scope, elm, attr, ctrl) {

        scope.collection = ctrl.getCollection();

        scope.isValid = function(){
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function(){
          //add property to setted filters on collection for empty state
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          EmptyState.pushFilter(scope.collection, property);

          //persist filter values
          Persistance.saveFilterValues(scope.collection);

          //fetch data and reset filtered property for this selectbox if the filter value or customUrlParameter is empty
          var searchValue = scope.customUrlParameter ? scope.collection.filterable.customUrlParams[scope.customUrlParameter] : scope.collection.filterable.filterValues[scope.property];

          scope.collection.fetch().then(function(collection){
            if(!searchValue){
              EmptyState.removeFilter(collection, property);
            }
          });
        };
      }
    };
  }])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarFilters
 * @element div
 * @description
 *
 * Container for filters
 *
 */
  .directive('mwSidebarFiltersBb', ['Persistance', 'EmptyState', function (Persistance, EmptyState) {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarFilters.html',
      link: function (scope, elm, attr) {

        scope.collection = scope.$eval(attr.collection);
        if(!angular.isDefined(scope.collection)){
          throw new Error('mwSidebarFiltersBb does not have a collection!');
        }

        scope.resetFiltersOnClose = function () {
          if (!scope.toggleFilters) {
            scope.collection.filterable.resetFilters();
            Persistance.clearFilterValues(scope.collection);
            scope.collection.fetch().then(function(collection){
              EmptyState.resetFilter(collection);
            });
          }
        };

        //open filters when there are persisted filters saved
        if(Persistance.getFilterValues(scope.collection)){
          scope.toggleFilters = true;
        }
      },
      controller: ['$scope', function($scope){
        this.getCollection = function(){
          return $scope.collection;
        };
      }]
    };
  }]);



'use strict';

angular.module('mwTabs', [])

    .directive('mwTabs', function () {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          justified: '=',
          activePaneNumber: '='
        },
        transclude: true,
        templateUrl: 'uikit/templates/mwTabs.html',
        controller: ['$scope', function ($scope) {
          var panes = $scope.panes = [];

          $scope.select = function (pane) {
            angular.forEach(panes, function (p) {
              p.selected = false;
            });

            if($scope.activePaneNumber){
              $scope.activePaneNumber = _.indexOf($scope.panes,pane)+1;
            }

            pane.selected = true;
          };

          this.registerPane = function (pane) {
            if ( ( $scope.activePaneNumber && $scope.activePaneNumber-1 === panes.length) || (!panes.length && !$scope.activePaneNumber) ) {
              var bak = $scope.activePaneNumber;
              $scope.select(pane);
              $scope.activePaneNumber = bak;
            }
            panes.push(pane);
          };
        }]
      };
    })

    .directive('mwTabsPane', function () {
      return {
        restrict: 'A',
        scope: {
          title: '@mwTabsPane',
          isInvalid: '='
        },
        replace: true,
        transclude: true,
        require: '^mwTabs',
        template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>',
        link: function (scope, elm, attr, mwTabsCtrl) {
          mwTabsCtrl.registerPane(scope);
        }

      };
    });
'use strict';

angular.module('mwToast', [])

  .directive('mwToasts', ['Toast', function (Toast) {
    return {
      templateUrl: 'uikit/templates/mwToast/mwToasts.html',
      link: function (scope) {
        scope.toasts = Toast.getToasts();

        scope.$watch(function () {
          return Toast.getToasts().length;
        }, function () {
          scope.toasts = Toast.getToasts();
        });

        scope.hideToast = function (toastId) {
          Toast.removeToast(toastId);
        };

      }
    };
  }])

  .provider('Toast', function () {

    var _autoHideTime = 5000,
      _toasts = [];

    var Toast = function (message, options) {
      options = options || {};
      options.button = options.button || {};

      var replaceMessage = function (newMessage) {
        toast.message = newMessage;
        toast.replaceCount++;
        resetAutoHideTimer();
      };

      var setAutoHideCallback = function (fn) {
        toast.autoHideCallback = fn;
        resetAutoHideTimer();
      };

      var resetAutoHideTimer = function () {
        if (_autoRemoveTimeout) {
          window.clearTimeout(_autoRemoveTimeout);
        }
        startAutoHideTimer();
      };

      var startAutoHideTimer = function () {
        if (toast.autoHide) {
          _autoRemoveTimeout = window.setTimeout(function () {
            if (toast.autoHideCallback && typeof toast.autoHideCallback === 'function') {
              toast.visible = false;
              toast.autoHideCallback.apply(this, arguments);
            }
          }.bind(this), toast.autoHideTime);
        }
      };

      var toast = {
          id: options.id || _.uniqueId('toast'),
          type: options.type || 'default',
          visible: true,
          message: message,
          title: options.title,
          autoHide: options.autoHide || false,
          autoHideTime: options.autoHideTime || 5000,
          autoHideCallback: options.autoHideCallback,
          isHtmlMessage: options.isHtmlMessage,
          button: {
            title: options.button.title,
            link: options.button.link,
            target: options.button.target,
            isLink: options.button.isLink || !!options.button.link,
            action: options.button.action
          },
          replaceMessage: replaceMessage,
          replaceCount: 0,
          setAutoHideCallback: setAutoHideCallback,
          initDate: +new Date()
        },
        _autoRemoveTimeout;

      startAutoHideTimer();

      return toast;
    };

    this.setAutoHideTime = function (timeInMs) {
      _autoHideTime = timeInMs;
    };

    this.$get = ['$timeout', function ($timeout) {

      return {
        findToast: function (id) {
          var toastContainer = _.findWhere(_toasts, {id: id});
          if (toastContainer) {
            return toastContainer.toast;
          } else {
            return false;
          }
        },
        clear: function () {
          _toasts = [];
        },
        getToasts: function () {
          return _.pluck(_toasts, 'toast');
        },
        replaceToastMessage: function (id, message) {

          var toast = this.findToast(id);

          if (toast) {
            toast.replaceMessage(message);
          }

          return toast;
        },
        removeToast: function (id) {
          var match = _.findWhere(_toasts, {id: id}),
            index = _.indexOf(_toasts, match);

          if (match) {
            _toasts.splice(index, 1);
          }

          return match;
        },
        addToast: function (message, options) {
          options = options || {};

          options.autoHideTime = options.autoHideTime || _autoHideTime;

          var existingToast = this.findToast(options.id);

          if (existingToast) {
            this.replaceToastMessage(existingToast.id, message);
          } else {
            var toast = new Toast(message, options);

            var removeFn = function () {
              $timeout(function () {
                if (options.autoHideCallback && typeof options.autoHideCallback === 'function') {
                  options.autoHideCallback.apply(this, arguments);
                }
                this.removeToast(toast.id);
              }.bind(this));
            }.bind(this);

            toast.setAutoHideCallback(removeFn);

            _toasts.push({id: toast.id, toast: toast});

            return toast;
          }
        }
      };
    }];
  });

'use strict';

angular.module('mwWizard', [])

/**
 *
 * @ngdoc object
 * @name mwWizard.Wizard
 * @description
 *
 * The wizard service handles the wizzard. The wizzard can be accessed from controlelr to navigate from step
 * to step. This service is depandant of the mwWizard and mwWizardStep directive. By transluding multiple
 * mwWizardStep directives into the mwWizard directive the Wizard service is populated with steps. BY calling the
 * functions back(), next(), goTo(num) the wizard service hides the currently active steps and displays the next step
 *
 * The wizard has to be initialized with the function createWizard(id). The function returns a a wizard object
 *
 *
 */
  .service('Wizard', function () {

    var wizards = [];

    var Wizard = function (id) {

      var _steps = [],
        _currentlyActive = 0,
        _id = id;

      /*
       * name _registerStep()
       * @description
       * This method should not be called manually but rather automatically by using the mwWizardStep directive
       */
      this._registerStep = function (step, id) {
        if (_steps.length < 1) {
          step._isActive = true;
        }
        step.slideId = id || _.uniqueId(_id + '_');
        _steps.push(step);
      };

      /*
       * name _registerStep()
       * @description
       * This method should not be called manually but rather automatically by using the mwWizardStep directive
       */
      this._unRegisterStep = function (scope) {
        var scopeInArray = _.findWhere(_steps, {$id: scope.$id}),
          indexOfScope = _.indexOf(_steps, scopeInArray);

        if (indexOfScope > -1) {
          _steps.splice(indexOfScope, 1);
        }
      };

      this.destroy = function () {
        var self = this;
        _steps.forEach(function (step) {
          self._unRegisterStep(step);
        });
      };

      this.getId = function () {
        return _id;
      };

      this.getAllSteps = function () {
        return _steps;
      };

      this.getCurrentStep = function () {
        return _steps[_currentlyActive];
      };

      this.getCurrentStepNumber = function () {
        return _currentlyActive;
      };

      this.getCurrentStepId = function () {
        return _steps[_currentlyActive].slideId;
      };

      this.getTotalStepAmount = function () {
        return _steps.length;
      };

      this.hasNextStep = function () {
        return this.getCurrentStepNumber() < this.getTotalStepAmount() - 1;
      };

      this.hasPreviousStep = function () {
        return this.getCurrentStepNumber() > 0;
      };

      /*
       * name next()
       * @description
       * Navigates to the next step of the currently active step
       */
      this.next = function () {
        this.goTo(_currentlyActive + 1);
      };

      /*
       * name back()
       * @description
       * Navigates to the previous step of the currently active step
       */
      this.back = function () {
        this.goTo(_currentlyActive - 1);
      };

      this.gotoStep = function (step) {

        if (typeof step === 'string') {
          step = _.findWhere(_steps, {slideId: step});
        }

        this.goTo(_.indexOf(_steps, step));
      };

      /*
       * name goTo()
       * @description
       * Goto a specific step number
       *
       * @params {integer} number of the step where you want to navigate to
       */
      this.goTo = function (num) {
        _steps[_currentlyActive]._isActive = false;
        if (num >= _steps.length) {
          throw new Error('Step ' + (num + 1) + ' is not available');
        } else {
          _steps[num]._isActive = true;
          _currentlyActive = num;
        }
      };

    };

    /*
     * name findWizard()
     * @description
     * Finds an existing instance of a wizzard with a certain id but throws NO error
     * when the wizard with the id could not be found
     *
     * @params {string} id Unique identifier of the Wizard you want to find
     * @returns {object} wizard returns wizard object
     */
    var findWizard = function (id) {
      var _wizard = null;
      wizards.forEach(function (wizard) {
        if (wizard.getId === id) {
          _wizard = wizard;
        }
      });
      return _wizard;
    };

    /*
     * name getWizard()
     * @description
     * Finds an existing instance of a wizzard with a certain id and throws an error
     * when the wizard with the id could not be found
     *
     * @params {string} id Unique identifier of the Wizard you want to find
     * @returns {object} wizard returns wizard object
     */
    var getWizard = function (id) {
      var _wizard = findWizard(id);
      if (!_wizard) {
        throw new Error('The wizard with the id ' + id + ' does not exist');
      } else {
        return _wizard;
      }

    };

    /*
     * name createWizard
     * @description
     * Creates an instance of Wizard. Throws an error when wizzard with the id
     * could not be found or is not initialized yet
     *
     * @param {string} id Unique identifier of the Wizard
     * @returns {object} wizard returns wizard object
     */
    var createWizard = function (id) {
      if (findWizard(id)) {
        throw new Error('The wizard with the id ' + id + ' is already existing');
      } else {
        var wizard = new Wizard(id);
        wizards.push(wizard);
        return wizard;
      }
    };

    //Public interface of the service
    return {
      createWizard: createWizard,
      getWizard: getWizard
    };

  })

/**
 * @ngdoc directive
 * @name mwWizard.directive:mwWizard
 * @element div
 * @description
 *
 * Multiple wizard steps can be transcluded into this directive. This Directive handles the
 * registration of every single wizard step
 *
 * @param {wizard} mw-wizard Wizard instance created by the Wizard service.
 */
  .directive('mwWizard', function () {
    return {
      restrict: 'A',
      scope: {
        wizard: '=mwWizard'
      },
      transclude: true,
      template: '<div ng-transclude class="mw-wizard"></div>',
      controller: ['$scope', function ($scope) {

        var wizard = $scope.wizard;

        this.registerStep = function (scope, id) {
          wizard._registerStep(scope, id);
        };

        this.unRegisterStep = function (scope) {
          wizard._unRegisterStep(scope);
        };

        $scope.$on('$destroy', function () {
          wizard.destroy();
        });

      }]
    };
  })

/**
 * @ngdoc directive
 * @name mwWizard.directive:mwWizardStep
 * @element div
 * @description
 *
 * Registers itself as a step in the mwWizard directive. The Wizard services handles the show and hide of
 * this directive
 *
 */
  .directive('mwWizardStep', function () {
    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      replace: true,
      require: '^mwWizard',
      template: '<div class="mw-wizard-step" ng-class="{active:_isActive}" ng-show="_isActive"><div class="mw-wizard-step-inner" ng-transclude ng-if="_isActive"></div></div>',
      link: function (scope, el, attr, mwWizardCtrl) {
        scope._isActive = false;
        //we need to set a default value here, see
        //https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11
        attr.title = attr.title || 'noname';
        attr.$observe('title', function (title) {
          if (title && title.length > 0) {
            scope.title = title;
          }
          mwWizardCtrl.registerStep(scope, attr.id);
        });

        scope.$on('$destroy', function () {
          mwWizardCtrl.unRegisterStep(scope);
        });
      }
    };
  });


angular.module("mwUI").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('uikit/templates/mwComponents/_mwMarkdownPreviewPopoper.html',
    "<div class=\"mw-markdown-preview-popover\"><p>{{ 'markdownTooltip.description' | i18n }}</p><h1>#{{ 'markdownTooltip.level1Header' | i18n }}</h1><h2>##{{ 'markdownTooltip.level2Header' | i18n }}</h2>{{ 'markdownTooltip.list' | i18n }}<ul><li>* {{ 'markdownTooltip.item' | i18n }} 1</li><li>* {{ 'markdownTooltip.item' | i18n }} 2</li><li>* {{ 'markdownTooltip.item' | i18n }} 3</li></ul><ol><li>1. {{ 'markdownTooltip.item' | i18n }}</li><li>2. {{ 'markdownTooltip.item' | i18n }}</li><li>3. {{ 'markdownTooltip.item' | i18n }}</li></ol><p>{{ 'markdownTooltip.link' | i18n }}</p></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwAlert.html',
    "<div class=\"alert alert-dismissable alert-{{ type }}\"><div ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwCollapsable.html',
    "<div class=\"mw-collapsable\"><div class=\"mw-collapsable-heading\" ng-click=\"toggle()\"><i class=\"fa fa-angle-right\" ng-class=\"{'fa-rotate-90': viewModel.collapsed}\"></i> <span class=\"mw-collapsable-heading-text\">{{title}}</span></div><div ng-class=\"{'collapsed': viewModel.collapsed}\" class=\"mw-collapsable-body mw-collapsable-animate margin-top-5\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwFilterableSearch.html',
    "<div class=\"row mw-filterable-search\"><div class=\"col-md-12\"><div class=\"input-group\"><input type=\"text\" placeholder=\"{{ 'common.search' | i18n }}\" class=\"form-control\" ng-keyup=\"search($event)\" ng-model=\"model.value\" ng-disabled=\"mwDisabled\"> <span class=\"input-group-addon filterable-search-btn\" ng-click=\"search()\"><span ng-show=\"searching\" class=\"search-indicator\"></span> <span ng-hide=\"(searching || model.value.length>0) || isMobile\" mw-icon=\"search\"></span> <span ng-if=\"(model.value.length>0 && !searching) && !isMobile\" mw-icon=\"rln-icon add\" class=\"red rotate-45\" ng-click=\"reset()\"></span></span></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwHeader.html',
    "<div class=\"nav-bar-holder mwHeader\"><div class=\"nav-bar-fixer\"><nav class=\"navbar navbar-default\" role=\"navigation\"><div class=\"navbar-header col-xs-12\"><div ng-if=\"showBackButton\" class=\"back\" data-text=\"{{'common.back' | i18n}}\" ng-click=\"back()\"><span mw-icon=\"fa-angle-left\"></span></div><h2 class=\"lead pull-left clearfix\"><span mw-icon=\"{{mwTitleIcon}}\" class=\"header-icon\" ng-if=\"mwTitleIcon\"></span><div ng-repeat=\"breadCrumb in mwBreadCrumbs\" class=\"mw-bread-crumbs\"><a ng-href=\"{{breadCrumb.url}}\" class=\"bread-crumb\">{{breadCrumb.title}}</a> <i mw-icon=\"fa-caret-right\" class=\"arrow\"></i></div><div class=\"page-title\" ng-click=\"refresh()\">{{title}}</div></h2><div class=\"pull-right header-popover\" mw-tooltip=\"{{ warningText }}\" style=\"font-size: 30px; margin-left:4px\"><span ng-if=\"warningCondition\" class=\"text-warning\" mw-icon=\"fa-warning\"></span> <span class=\"popover-container\" style=\"font-size: 14px\"></span></div><div class=\"pull-right\" ng-transclude></div></div></nav></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwMarkdownPreview.html',
    "<div class=\"toggler text-right text-muted\"><span ng-click=\"showPreview = !showPreview\" title=\"Show Markdown Preview\">{{ showPreview ? 'common.hidePreview' : 'common.showMarkdownPreview' | i18n }}</span> <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\"><span mw-popover=\"markdownTooltip\" popover-url=\"uikit/templates/mwComponents/_mwMarkdownPreviewPopoper.html\" popover-trigger=\"hover\" popover-position=\"bottom\" popover-title=\"Markdown Syntax\"><span mw-icon=\"fa-question-circle\"></span></span></a></div><div ng-if=\"showPreview\" class=\"preview\" mw-markdown=\"mwModel\"></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwOptionGroup.html',
    "<div class=\"mw-option-group panel panel-default\"><fieldset ng-disabled=\"mwDisabled\"><div class=\"panel-body\"><span ng-transclude></span><label class=\"options-container display-inline clickable\" ng-class=\"{'with-icon':icon}\" for=\"{{randomId}}\"><div class=\"clearfix\"><div ng-if=\"icon\" class=\"col-md-1 icon-holder\"><span mw-icon=\"{{icon}}\"></span></div><div class=\"description\" ng-class=\"{'col-md-11': icon, 'col-md-12': !icon}\"><h4>{{title}}</h4><p>{{description}}</p></div></div></label></div></fieldset></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwPanel.html',
    "<div class=\"panel panel-default\"><div class=\"panel-body\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwSortIndicator.html',
    "<span class=\"sort-indicators\"><i ng-show=\"!isActive\" mw-icon=\"fa-sort\" class=\"sort-indicator\"></i> <i ng-if=\"isActive && !isReversed\" mw-icon=\"fa-sort-asc\"></i> <i ng-if=\"isActive && isReversed\" mw-icon=\"fa-sort-desc\"></i></span>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwTextCollapse.html',
    "<div ng-if=\"markdown\"><div mw-markdown=\"text()\"></div><a ng-if=\"showButton\" ng-click=\"toggleLength()\" style=\"cursor: pointer\">{{ showLessOrMore() | i18n }}</a></div><div ng-if=\"!markdown\"><span class=\"line-break\">{{ text() }}</span> <a ng-if=\"showButton\" ng-click=\"toggleLength()\" style=\"cursor: pointer\">{{ showLessOrMore() | i18n }}</a></div>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwTimelineFieldset.html',
    "<fieldset class=\"mw-timeline-fieldset\" ng-class=\"{'entries-are-hidden':!entriesVisible, 'collapsable': collapsable}\"><div ng-if=\"mwTitle\" ng-click=\"toggleEntries()\" class=\"legend\">{{mwTitle}} <span ng-if=\"collapsable && entriesVisible\" class=\"toggler\"><i mw-icon=\"fa-chevron-circle-down\"></i></span> <span ng-if=\"collapsable && !entriesVisible\" class=\"toggler\"><i mw-icon=\"fa-chevron-circle-up\"></i></span></div><div ng-show=\"!entriesVisible\" class=\"hidden-entries\" ng-click=\"toggleEntries()\">{{ hiddenEntriesText() | i18n:{count:entries.length} }}</div><ul class=\"clearfix timeline-entry-list\" ng-transclude ng-show=\"entriesVisible\"></ul></fieldset>"
  );


  $templateCache.put('uikit/templates/mwComponents/mwToggle.html',
    "<span class=\"mw mw-toggle\"><button class=\"no toggle btn btn-link\" ng-click=\"toggle(true)\" ng-disabled=\"mwDisabled\"><span>{{ 'common.on' | i18n }}</span></button> <button class=\"yes toggle btn btn-link\" ng-click=\"toggle(false)\" ng-disabled=\"mwDisabled\"><span>{{ 'common.off' | i18n }}</span></button> <span class=\"label indicator\" ng-class=\"{ true: 'label-success enabled', false: 'label-danger' }[mwModel]\"></span></span>"
  );


  $templateCache.put('uikit/templates/mwComponentsBb/mwEmptyStateBb.html',
    "<div><!-- using ng-show instead of ng-if due to angular bug (see link)\n" +
    "       angular 1.3 fixes this issue, we should replace ng-show after 1.3 migration\n" +
    "       https://github.com/vojtajina/angular.js/commit/d414b787173643362c0c513a1929d8e715ca340e --><div ng-if=\"!showEmptyState()\" ng-transclude></div><div ng-if=\"showEmptyState()\" class=\"mw-empty-state\"><img src=\"images/logo-grey.png\"><h2 class=\"lead\">{{ text | i18n }}</h2><div ng-if=\"buttonText\"><button class=\"btn btn-primary btn-large\" ng-click=\"button()\">{{buttonText}}</button></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponentsBb/mwFilterableSearch.html',
    "<div class=\"row mw-filterable-search\"><div class=\"col-md-12\"><div class=\"input-group\"><input ng-if=\"!customUrlParameter\" type=\"text\" placeholder=\"{{ 'common.search' | i18n }}\" class=\"form-control\" ng-keyup=\"search($event)\" ng-model=\"collection.filterable.filterValues[property]\" ng-disabled=\"mwDisabled\"> <input ng-if=\"customUrlParameter\" type=\"text\" placeholder=\"{{ 'common.search' | i18n }}\" class=\"form-control\" ng-keyup=\"search($event)\" ng-model=\"collection.filterable.customUrlParams[customUrlParameter]\" ng-disabled=\"mwDisabled\"> <span class=\"input-group-addon filterable-search-btn\" ng-click=\"performAction()\"><span ng-show=\"searching\" class=\"search-indicator\"></span> <span ng-hide=\"searching || showResetIcon()\"><span mw-icon=\"search\"></span></span> <span ng-if=\"showResetIcon() && !searching\" mw-icon=\"fa-times\" class=\"red\"></span></span></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwComponentsBb/mwVersionSelector.html',
    "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-default dropdown-toggle hidden-xs\" data-toggle=\"dropdown\">Version {{currentVersionModel.attributes[versionNumberKey]}} <span ng-if=\"currentVersionModel.attributes.published\" mw-icon=\"rln-icon published\"></span></button><ul class=\"version-dropdown dropdown-menu pull-right\" style=\"min-width:100%\" role=\"menu\"><li ng-repeat=\"version in versionCollection.models\" ng-class=\"{active:(version.attributes.uuid === currentVersionModel.attributes.uuid)}\"><a ng-href=\"{{getUrl(version.attributes.uuid)}}\">{{version.attributes[versionNumberKey]}} <span ng-if=\"version.attributes.published\" mw-icon=\"rln-icon published\"></span></a></li></ul></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormActions.html',
    "<div class=\"mw-form mw-actions\"><div class=\"btn-group\"><button type=\"button\" class=\"btn btn-danger\" ng-if=\"hasCancel && _showCancel\" ng-disabled=\"form.$pristine && executeDefaultCancel\" ng-click=\"cancelFacade()\"><span mw-icon=\"rln-icon close_cross\"></span> <span class=\"action-text cancel\">{{ 'common.cancel' | i18n }}</span></button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"saveFacade()\" ng-if=\"hasSave && _showSave\" ng-disabled=\"form.$invalid || isLoading() || (form.$pristine && executeDefaultCancel)\"><span mw-icon=\"rln-icon check\"></span> <span class=\"action-text save\">{{ 'common.save' | i18n }}</span></button></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormCheckbox.html',
    "<div class=\"mw-form-checkbox mw-form form-group clearfix\" ng-class=\"mwClass\"><div class=\"col-sm-offset-3 col-sm-9\"><div class=\"checkbox\"><label><div ng-transclude></div>{{ label }}</label><span ng-if=\"tooltip\" mw-icon=\"rln-icon support\" tooltip=\"{{ tooltip }}\"></span> <span ng-repeat=\"badge in typedBadges\" ng-class=\"'label-' + badge.type\" class=\"mw-badge label\">{{ badge.text }}</span></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormInput.html',
    "<div class=\"mw-form mw-form-input form-group\" ng-class=\"{'has-error': isInvalid() && isDirty(), 'is-required': isRequired(), 'is-required-error':isRequiredError() }\"><div class=\"clearfix\"><label ng-if=\"label\" class=\"col-sm-3 control-label\">{{ label }} <span ng-if=\"tooltip\" mw-icon=\"rln-icon support\" tooltip=\"{{ tooltip }}\"></span></label><div ng-class=\"{ true: 'col-sm-6 col-lg-5', false: 'col-sm-12' }[label.length > 0]\" ng-transclude></div></div><div ng-if=\"hideErrors !== true\" ng-class=\"{ true: 'col-sm-6 col-sm-offset-3', false: 'col-sm-12' }[label.length > 0]\"><span ng-if=\"hideErrors !== true && hideErrors !== key && isInvalid()\" ng-repeat=\"(key, value) in getCurrentErrors()\" mw-form-validation=\"{{ key }}\">{{ validationValues[key] }}</span></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormMultiSelect.html',
    "<div ng-form><div ng-class=\"{'has-error': showRequiredMessage()}\"><div class=\"checkbox\" ng-repeat=\"(key,value) in filter(options)\"><label><input type=\"checkbox\" name=\"selectOption\" mw-custom-checkbox ng-checked=\"model.indexOf(key) >= 0\" ng-click=\"toggleKeyIntoModelArray(key); setDirty()\"> {{ value }}</label></div><div mw-form-input><input type=\"hidden\" name=\"requireChecker\" ng-model=\"model[0]\" ng-required=\"mwRequired\"></div><!--<div ng-class=\"col-sm-12\">--><!--<span class=\"help-block\" ng-show=\"showRequiredMessage()\">{{'errors.isRequired' | i18n}}</span>--><!--</div>--><div ng-show=\"getObjectSize(filter(options)) == 0\" ng-transclude></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormMultiSelect2.html',
    "<div ng-form class=\"mw-form mw-form-multi-select\"><div ng-class=\"{'has-error': showRequiredMessage()}\"><div class=\"checkbox\" ng-repeat=\"model in mwOptionsCollection.models\"><label><input type=\"checkbox\" name=\"selectOption\" ng-disabled=\"mwDisabled\" mw-custom-checkbox ng-checked=\"mwCollection.findWhere(model.toJSON())\" ng-click=\"toggleModel(model); setDirty()\"> <span ng-if=\"!mwOptionsLabelI18nPrefix\">{{ model.get(mwOptionsLabelKey) }}</span> <span ng-if=\"mwOptionsLabelI18nPrefix\">{{mwOptionsLabelI18nPrefix+'.'+model.get(mwOptionsLabelKey) | i18n}}</span></label></div><div mw-form-input><span mw-validate-collection-or-model=\"mwCollection\" mw-required=\"mwRequired\"></span></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwFormWrapper.html',
    "<div class=\"mw-form mw-form-wrapper form-group\" ng-class=\"{'is-required': isRequired()}\"><label ng-if=\"label\" class=\"col-sm-3 control-label\">{{ label }} <span ng-if=\"tooltip\" mw-icon=\"rln-icon support\" tooltip=\"{{ tooltip }}\"></span></label><div class=\"col-sm-6 col-lg-5\" ng-class=\"{ false: 'col-sm-offset-3' }[label.length > 0]\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwForm/mwLeaveConfirmation.html',
    "<div mw-modal title=\"{{'common.confirmModal.title' | i18n}}\"><div mw-modal-body><p>{{ text }}</p></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" ng-click=\"continue()\">{{'common.confirmModal.continue' | i18n }}</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"stay()\">{{'common.confirmModal.stay' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwFormMultiSelect.html',
    "<div ng-form><div class=\"checkbox\" ng-repeat=\"item in collection.models\"><label><input type=\"checkbox\" name=\"selectOption\" mw-custom-checkbox ng-disabled=\"isDisabled(item)\" ng-checked=\"model.indexOf(item.attributes.key) >= 0\" ng-click=\"toggleKeyIntoModelArray(item.attributes.key); setDirty()\"> {{ translationPrefix + '.' + item.attributes.key | i18n }}</label></div><div mw-form-input><input type=\"hidden\" name=\"requireChecker\" ng-model=\"model[0]\" ng-required=\"mwRequired\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwFormRadioGroup.html',
    "<form class=\"mw-form mw-form-radio-group\"><div ng-repeat=\"option in mwOptionsCollection.models\"><label><input type=\"radio\" name=\"radio_group_item\" ng-value=\"option.get(optionsKey)\" mw-custom-radio ng-model=\"$parent.mwModel\" ng-disabled=\"mwDisabled\"> <span ng-if=\"option.get(mwOptionsLabelKey) && !mwOptionsLabelI18nPrefix\">{{option.get(mwOptionsLabelKey)}}</span> <span ng-if=\"option.get(mwOptionsLabelKey) && mwOptionsLabelI18nPrefix\">{{mwOptionsLabelI18nPrefix+'.'+option.get(mwOptionsLabelKey) | i18n}}</span></label></div></form><input type=\"hidden\" name=\"{{name}}\" ng-model=\"mwModel\" required>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwFormSelect.html',
    "<select class=\"form-control mw-form-select\" mw-custom-select ng-model=\"viewModel.val\" ng-change=\"mwChange({selectedModel:getSelectedModel(viewModel.val)})\" ng-options=\"getKey(option) as getLabel(option) for option in mwOptionsCollection.models\" ng-disabled=\"mwDisabled\" ng-required=\"mwRequired\" name=\"{{name}}\"><option value=\"\" ng-show=\"!mwRequired || mwPlaceholder\" ng-disabled=\"mwRequired\">{{ mwPlaceholder?mwPlaceholder:''}}</option></select>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwMultiSelectBox.html',
    "<div class=\"multi-select-box\"><div class=\"col-xs-7 col-sm-8 col-md-9\"><select ng-options=\"getLabel(item) for item in collectionWithoutSelected(privateCollection.models[$index]).models track by item.id\" mw-custom-select ng-model=\"privateCollection.models[$index]\" ng-change=\"change()\" ng-disabled=\"mwDisabled\"></select></div><div class=\"col-xs-5 col-sm-4 col-md-3 toggle-btns\"><button ng-click=\"remove(model)\" ng-disabled=\"mwDisabled\" class=\"btn btn-default remove\"><span mw-icon=\"fa-minus\"></span></button> <button ng-if=\"$last === true\" ng-click=\"add()\" ng-disabled=\"privateCollection.models[$index].id === undefined ||  privateCollection.length === inputCollection.length || mwDisabled\" class=\"btn btn-default add\"><span mw-icon=\"fa-plus\"></span></button></div></div>"
  );


  $templateCache.put('uikit/templates/mwFormBb/mwMultiSelectBoxes.html',
    "<div class=\"mw-multi-select-boxes\"><div ng-if=\"privateCollection.models.length>0\" mw-multi-select-box class=\"row\" ng-class=\"{true: 'margin-top-5'}[!$first]\" ng-repeat=\"model in privateCollection.models\"></div><p ng-if=\"privateCollection.models.length===0\" class=\"margin-top-5\">{{'common.noOptionsAv' | i18n}}</p><input type=\"hidden\" ng-model=\"requiredValue\" ng-required=\"mwRequired\" name=\"{{hiddenFormElementName || 'mwMultiSelectBoxes'}}\"></div>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableColumnCheckbox.html',
    "<input ng-if=\"!radio\" type=\"checkbox\" ng-click=\"click(item, $event)\" ng-disabled=\"mwDisabled || false\" ng-checked=\"selectable.isSelected(item)\" mw-custom-checkbox> <input ng-if=\"radio\" type=\"radio\" name=\"{{selectable.id}}\" ng-click=\"click(item, $event)\" ng-disabled=\"mwDisabled || false\" ng-checked=\"selectable.isSelected(item)\" mw-custom-radio>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableFooter.html',
    "<tr><td colspan=\"{{ columns.length + 4 }}\"><div ng-if=\" (!filterable.items() && filterable) || (filterable.items().length < filterable.total() && Loading.isLoading()) \"><div rln-spinner></div></div><div ng-if=\"filterable.items().length < 1\" class=\"text-center\"><p class=\"lead\">{{ 'common.noneFound' | i18n }}</p></div><button ng-if=\"filterable.items().length < filterable.total() && !Loading.isLoading()\" class=\"btn btn-default btn-lg col-md-12\" ng-click=\"filterable.loadMore()\">{{ 'common.loadMore' | i18n }}</button></td></tr>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableHeader.html',
    "<th ng-class=\"{ clickable: property, 'sort-active':(property && isSelected())||sortActive }\"><span ng-if=\"property\" ng-click=\"toggleSortOrder()\" class=\"sort-indicators\"><i ng-show=\"property && !isSelected()\" mw-icon=\"fa-sort\" class=\"sort-indicator\"></i> <i ng-if=\"isSelected('-')\" mw-icon=\"fa-sort-asc\"></i> <i ng-if=\"isSelected('+')\" mw-icon=\"fa-sort-desc\"></i></span> <span ng-transclude class=\"title\"></span></th>"
  );


  $templateCache.put('uikit/templates/mwListable/mwListableHeaderCheckbox.html',
    "<input type=\"checkbox\" ng-if=\"!radio && (!filterable || filterable.items().length > 0)\" ng-click=\"toggleAll()\" ng-checked=\"selectable.allSelected()\" ng-disabled=\"selectable.allDisabled()\" mw-custom-checkbox>"
  );


  $templateCache.put('uikit/templates/mwListableBb/mwListableColumnCheckbox.html',
    "<input ng-if=\"!isSingleSelection\" type=\"checkbox\" ng-click=\"click(item, $event)\" ng-disabled=\"item.selectable.isDisabled()\" ng-checked=\"item.selectable.isSelected()\" mw-custom-checkbox> <input ng-if=\"isSingleSelection\" type=\"radio\" name=\"{{selectable.id}}\" ng-click=\"click(item, $event)\" ng-disabled=\"item.selectable.isDisabled()\" ng-checked=\"item.selectable.isSelected()\" mw-custom-radio>"
  );


  $templateCache.put('uikit/templates/mwListableBb/mwListableFooter.html',
    "<tr><td colspan=\"{{ columns.length + 4 }}\"><div ng-if=\"Loading.isLoading() && collection.filterable.hasNextPage()\"><div rln-spinner></div></div><div ng-if=\"collection.models.length < 1\" class=\"text-center\"><p class=\"lead\">{{ 'common.noneFound' | i18n }}</p></div><!--<button ng-if=\"collection.filterable.hasNextPage()\"\n" +
    "            class=\"btn btn-default btn-lg col-md-12\"\n" +
    "            ng-click=\"collection.filterable.loadNextPage()\">\n" +
    "      {{ 'common.loadMore' | i18n }}\n" +
    "    </button>--></td></tr>"
  );


  $templateCache.put('uikit/templates/mwListableBb/mwListableHead.html',
    "<div class=\"mw-listable-header clearfix\" ng-class=\"{'show-selected':canShowSelected()}\"><div class=\"selection-controller\" ng-if=\"selectable\"><span ng-click=\"toggleSelectAll()\" class=\"clickable select-all\" ng-if=\"!selectable.isSingleSelection()\"><span class=\"selected-icon\"><span class=\"indicator\" ng-if=\"selectable.allSelected()\"></span></span> <a href=\"#\" mw-prevent-default=\"click\">{{'common.selectAll' | i18n:{name: collectionName ||i18n.get('common.items')} }}</a></span> <span ng-if=\"selectedAmount > 0\" class=\"clickable clear\" ng-click=\"selectable.unSelectAll()\"><span mw-icon=\"rln-icon close_cross\"></span> <a href=\"#\" mw-prevent-default=\"click\">{{'common.clearSelection' | i18n}}</a></span></div><div class=\"search-bar\"></div><div class=\"selected-counter\"><span ng-if=\"selectable && selectedAmount>0\" class=\"clickable\" ng-click=\"toggleShowSelected()\"><a href=\"#\" mw-prevent-default=\"click\"><span ng-if=\"selectedAmount === 1\">{{'common.itemSelected' | i18n:{name: getModelAttribute(selectable.getSelected().first())} }}</span> <span ng-if=\"selectedAmount > 1\">{{'common.itemsSelected' | i18n:{name: collectionName, count: selectedAmount} }}</span> <span mw-icon=\"fa-angle-up\" ng-show=\"canShowSelected()\"></span> <span mw-icon=\"fa-angle-down\" ng-show=\"!canShowSelected()\"></span></a></span><div ng-if=\"!selectable || selectedAmount<1\" ng-transclude class=\"extra-content\"></div><span ng-if=\"!selectable || selectedAmount<1\">{{'common.itemAmount' | i18n:{name: collectionName, count: getTotalAmount()} }}</span></div><div class=\"selected-items\" ng-if=\"canShowSelected()\"><div class=\"items clearfix\"><div class=\"box-shadow-container\"><div ng-if=\"!isLoadingModelsNotInCollection\" ng-repeat=\"item in selectable.getSelected().models\" ng-click=\"unSelect(item)\" ng-class=\"{'label-danger':item.selectable.isDeletedItem}\" class=\"label label-default clickable\"><span ng-if=\"item.selectable.isDeletedItem\" mw-tooltip=\"{{'common.notAvailableTooltip' | i18n}}\"><span mw-icon=\"fa-warning\"></span>{{'common.notAvailable' | i18n}}</span> <span ng-if=\"!item.selectable.isDeletedItem\">{{getModelAttribute(item)}}</span> <span mw-icon=\"rln-icon close_cross\"></span></div><div ng-if=\"isLoadingModelsNotInCollection\"><div rln-spinner></div></div></div></div><div class=\"close-pane\" ng-click=\"hideSelected()\"></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwListableBb/mwListableHeader.html',
    "<th ng-class=\"{ clickable: property, 'sort-active':(property && isSelected())||sortActive }\"><span ng-if=\"property\" ng-click=\"toggleSortOrder()\" class=\"sort-indicators\"><i ng-show=\"property && !isSelected()\" mw-icon=\"fa-sort\" class=\"sort-indicator\"></i> <i ng-if=\"isSelected('-')\" mw-icon=\"fa-sort-asc\"></i> <i ng-if=\"isSelected('+')\" mw-icon=\"fa-sort-desc\"></i></span> <span ng-transclude class=\"title\"></span></th>"
  );


  $templateCache.put('uikit/templates/mwListableBb/mwListableHeaderCheckbox.html',
    "<input type=\"checkbox\" ng-if=\"!isSingleSelection\" ng-click=\"collection.selectable.toggleSelectAll()\" ng-checked=\"collection.selectable.allSelected()\" ng-disabled=\"collection.selectable.allDisabled()\" mw-custom-checkbox>"
  );


  $templateCache.put('uikit/templates/mwMap/mwMap.html',
    "<div><div id=\"map\" class=\"olMap\"></div><div ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwModal/mwModal.html',
    "<div class=\"modal fade\" tabindex=\"1\" role=\"dialog\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header clearfix\" ng-if=\"title\"><img ng-if=\"mwModalTmpl.getLogoPath()\" ng-src=\"{{mwModalTmpl.getLogoPath()}}\" class=\"pull-left logo\"><h4 class=\"modal-title pull-left\">{{ title }}</h4></div><div class=\"body-holder\"><div mw-toasts class=\"notifications\"></div><div ng-transclude class=\"modal-content-wrapper\"></div></div></div></div></div>"
  );


  $templateCache.put('uikit/templates/mwModal/mwModalConfirm.html',
    "<div mw-modal title=\"{{ 'common.areYouSure' | i18n }}\"><div mw-modal-body><div ng-transclude></div></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cancel()\">{{'common.cancel' | i18n }}</button> <button type=\"button\" mw-modal-on-enter class=\"btn btn-primary\" data-dismiss=\"modal\" ng-click=\"ok()\">{{'common.ok' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/templates/mwNav/mwNavbar.html',
    "<div class=\"navbar navbar-default navbar-fixed-top\" ng-transclude></div>"
  );


  $templateCache.put('uikit/templates/mwNav/mwNavbarBrand.html',
    "<div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\"><span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#/\" ng-transclude></a></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarFilters.html',
    "<div class=\"mw-sidebar-filters\"><div class=\"filter-toggler margin-top-10\"><a class=\"clickable btn btn-default btn-block\" ng-click=\"toggleFilters = !toggleFilters; resetFiltersOnClose()\"><span class=\"fa fa-times toggle-indicator rotate-45\" ng-class=\"{'red active':toggleFilters}\"></span> <span ng-if=\"toggleFilters\">{{'common.removeFilters' | i18n}}</span> <span ng-if=\"!toggleFilters\">{{'common.addFilter' | i18n}}</span></a></div><div ng-if=\"toggleFilters\" ng-transclude class=\"filters animate-height\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarPanel.html',
    "<div class=\"sidebar\" compile-callback><div ng-transclude class=\"content-container\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebar/mwSidebarSelect.html',
    "<div class=\"row\"><div class=\"col-md-12\"><select class=\"form-control\" mw-custom-select ng-model=\"model.value\" ng-change=\"filterable.applyFilters()\" ng-options=\"key as value for (key, value) in model.all\" ng-disabled=\"mwDisabled\"></select></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarFilters.html',
    "<div class=\"mw-sidebar-filters\"><div class=\"filter-toggler margin-top-10\"><a class=\"clickable btn btn-default btn-block\" ng-click=\"toggleFilters = !toggleFilters; resetFiltersOnClose()\"><span class=\"rln-icon close_cross toggle-indicator rotate-45\" ng-class=\"{'red active':toggleFilters}\"></span> <span ng-if=\"toggleFilters\">{{'common.removeFilters' | i18n}}</span> <span ng-if=\"!toggleFilters\">{{'common.addFilter' | i18n}}</span></a></div><div ng-if=\"toggleFilters\" ng-transclude class=\"filters animate-height\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarNumberInput.html',
    "<div class=\"row\"><div class=\"col-md-12 form-group\" ng-class=\"{'has-error': !isValid()}\" style=\"margin-bottom: 0\"><input type=\"number\" ng-if=\"!customUrlParameter\" class=\"form-control\" ng-model=\"collection.filterable.filterValues[property]\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" min=\"{{min}}\" max=\"{{max}}\" ng-model-options=\"{ debounce: 500 }\"><input type=\"number\" ng-if=\"customUrlParameter\" class=\"form-control\" ng-model=\"collection.filterable.customUrlParams[customUrlParameter]\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" min=\"{{min}}\" max=\"{{max}}\" ng-model-options=\"{ debounce: 500 }\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarSelect.html',
    "<div class=\"row\"><div class=\"col-md-12\"><select ng-if=\"!customUrlParameter\" class=\"form-control\" mw-custom-select ng-model=\"collection.filterable.filterValues[property]\" ng-change=\"changed()\" ng-options=\"key(model) as label(model) for model in options.models\" ng-disabled=\"mwDisabled\"><option value=\"\">{{ placeholder }}</option></select><select ng-if=\"customUrlParameter\" class=\"form-control\" mw-custom-select ng-model=\"collection.filterable.customUrlParams[customUrlParameter]\" ng-change=\"changed()\" ng-options=\"key(model) as label(model) for model in options.models\" ng-disabled=\"mwDisabled\"><option value=\"\">{{ placeholder }}</option></select></div></div>"
  );


  $templateCache.put('uikit/templates/mwTabs.html',
    "<div class=\"clearfix mw-tabs\" ng-class=\"{justified: justified}\"><ul class=\"nav nav-tabs\" ng-class=\"{ 'nav-justified': justified }\"><li ng-repeat=\"pane in panes\" ng-class=\"{ active: pane.selected }\"><a ng-class=\"{ 'has-error': pane.isInvalid }\" ng-click=\"select(pane)\">{{ pane.title }}</a></li></ul><div class=\"tab-content row\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/templates/mwToast/mwToasts.html',
    "<div class=\"message messages-list mw-toasts\"><div class=\"content\" ng-model=\"bootstrapClass\"><ul ng-if=\"toasts.length > 0\"><li ng-repeat=\"toast in toasts\" class=\"alert message-item alert-{{toast.type}}\"><strong ng-if=\"toast.title\">{{toast.title}}</strong><div class=\"holder\"><span ng-if=\"!toast.isHtmlMessage\">{{toast.message}}</span> <span ng-if=\"toast.isHtmlMessage\" ng-bind-html=\"toast.message\"></span> <a class=\"action-button btn btn-link btn-xs\" ng-if=\"toast.button && toast.button.isLink && toast.button.action && !toast.button.link\" href=\"#\"><span ng-click=\"hideToast(toast); toast.button.action()\" mw-prevent-default=\"click\">{{toast.button.title}}</span></a> <a class=\"action-button btn btn-link btn-xs\" ng-if=\"toast.button && toast.button.isLink && toast.button.link\" ng-href=\"{{toast.button.link}}\" target=\"{{toast.button.target}}\"><span>{{toast.button.title}}</span></a></div><div class=\"action-button btn btn-default btn-xs margin-top-5\" ng-if=\"toast.button && !toast.button.isLink && toast.button.action\"><div ng-click=\"hideToast(toast); toast.button.action()\">{{toast.button.title}}</div></div><div class=\"closer\" ng-click=\"hideToast(toast.id)\"><i class=\"rln-icon close_cross\"></i></div></li></ul></div></div>"
  );
}]);
/**
 * @license AngularJS v1.3.15
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   The input is sanitized by parsing the HTML into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer. The input may also contain SVG markup.
 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
 *
 * @param {string} html HTML input.
 * @returns {string} Sanitized HTML.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */
function $SanitizeProvider() {
  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));

// SVG Elements
// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
var svgElements = makeMap("animate,animateColor,animateMotion,animateTransform,circle,defs," +
        "desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient," +
        "line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,set," +
        "stop,svg,switch,text,title,tspan,use");

// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements,
                                   svgElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap,xlink:href");

var htmlAttrs = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
    'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
    'valign,value,vspace,width');

// SVG attributes (without "id" and "name" attributes)
// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
var svgAttrs = makeMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' +
    'attributeName,attributeType,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,' +
    'color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,' +
    'font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,' +
    'gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,' +
    'keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,' +
    'markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,' +
    'overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,' +
    'repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,' +
    'stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,' +
    'stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,' +
    'stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,' +
    'underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,' +
    'viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,' +
    'xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,' +
    'zoomAndPan');

var validAttrs = angular.extend({},
                                uriAttrs,
                                svgAttrs,
                                htmlAttrs);

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser(html, handler) {
  if (typeof html !== 'string') {
    if (html === null || typeof html === 'undefined') {
      html = '';
    } else {
      html = '' + html;
    }
  }
  var index, chars, match, stack = [], last = html, text;
  stack.last = function() { return stack[stack.length - 1]; };

  while (html) {
    text = '';
    chars = true;

    // Make sure we're not in a script or style element
    if (!stack.last() || !specialElements[stack.last()]) {

      // Comment
      if (html.indexOf("<!--") === 0) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if (index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment(html.substring(4, index));
          html = html.substring(index + 3);
          chars = false;
        }
      // DOCTYPE
      } else if (DOCTYPE_REGEXP.test(html)) {
        match = html.match(DOCTYPE_REGEXP);

        if (match) {
          html = html.replace(match[0], '');
          chars = false;
        }
      // end tag
      } else if (BEGING_END_TAGE_REGEXP.test(html)) {
        match = html.match(END_TAG_REGEXP);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(END_TAG_REGEXP, parseEndTag);
          chars = false;
        }

      // start tag
      } else if (BEGIN_TAG_REGEXP.test(html)) {
        match = html.match(START_TAG_REGEXP);

        if (match) {
          // We only have a valid start-tag if there is a '>'.
          if (match[4]) {
            html = html.substring(match[0].length);
            match[0].replace(START_TAG_REGEXP, parseStartTag);
          }
          chars = false;
        } else {
          // no ending tag found --- this piece should be encoded as an entity.
          text += '<';
          html = html.substring(1);
        }
      }

      if (chars) {
        index = html.indexOf("<");

        text += index < 0 ? html : html.substring(0, index);
        html = index < 0 ? "" : html.substring(index);

        if (handler.chars) handler.chars(decodeEntities(text));
      }

    } else {
      // IE versions 9 and 10 do not understand the regex '[^]', so using a workaround with [\W\w].
      html = html.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text) {
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars(decodeEntities(text));

          return "";
      });

      parseEndTag("", stack.last());
    }

    if (html == last) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = angular.lowercase(tagName);
    if (blockElements[tagName]) {
      while (stack.last() && inlineElements[stack.last()]) {
        parseEndTag("", stack.last());
      }
    }

    if (optionalEndTagElements[tagName] && stack.last() == tagName) {
      parseEndTag("", tagName);
    }

    unary = voidElements[tagName] || !!unary;

    if (!unary)
      stack.push(tagName);

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start(tagName, attrs, unary);
  }

  function parseEndTag(tag, tagName) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if (tagName)
      // Find the closest opened tag of the same type
      for (pos = stack.length - 1; pos >= 0; pos--)
        if (stack[pos] == tagName)
          break;

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (i = stack.length - 1; i >= pos; i--)
        if (handler.end) handler.end(stack[i]);

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
function decodeEntities(value) {
  if (!value) { return ''; }

  hiddenPre.innerHTML = value.replace(/</g,"&lt;");
  // innerText depends on styling as it doesn't display hidden elements.
  // Therefore, it's better to use textContent not to cause unnecessary reflows.
  return hiddenPre.textContent;
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function(value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value) {
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator) {
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary) {
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key) {
          var lkey=angular.lowercase(key);
          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
          if (validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag) {
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars) {
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <script>
         angular.module('linkyExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.snippet =
               'Pretty text with some links:\n'+
               'http://angularjs.org/,\n'+
               'mailto:us@somewhere.org,\n'+
               'another@somewhere.org,\n'+
               'and one more: ftp://127.0.0.1/.';
             $scope.snippetWithTarget = 'http://angularjs.org/';
           }]);
       </script>
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"”’]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/www/mailto then assume mailto
      if (!match[2] && !match[4]) {
        url = (match[3] ? 'http://' : 'mailto:') + url;
      }
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="',
                  target,
                  '" ');
      }
      html.push('href="',
                url.replace(/"/g, '&quot;'),
                '">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

;/*! showdown 27-08-2015 */
(function(){
/**
 * Created by Tivie on 13-07-2015.
 */

function getDefaultOpts(simple) {
  'use strict';

  var defaultOptions = {
    omitExtraWLInCodeBlocks: {
      default: false,
      describe: 'Omit the default extra whiteline added to code blocks',
      type: 'boolean'
    },
    noHeaderId: {
      default: false,
      describe: 'Turn on/off generated header id',
      type: 'boolean'
    },
    prefixHeaderId: {
      default: false,
      describe: 'Specify a prefix to generated header ids',
      type: 'string'
    },
    headerLevelStart: {
      default: false,
      describe: 'The header blocks level start',
      type: 'integer'
    },
    parseImgDimensions: {
      default: false,
      describe: 'Turn on/off image dimension parsing',
      type: 'boolean'
    },
    simplifiedAutoLink: {
      default: false,
      describe: 'Turn on/off GFM autolink style',
      type: 'boolean'
    },
    literalMidWordUnderscores: {
      default: false,
      describe: 'Parse midword underscores as literal underscores',
      type: 'boolean'
    },
    strikethrough: {
      default: false,
      describe: 'Turn on/off strikethrough support',
      type: 'boolean'
    },
    tables: {
      default: false,
      describe: 'Turn on/off tables support',
      type: 'boolean'
    },
    tablesHeaderId: {
      default: false,
      describe: 'Add an id to table headers',
      type: 'boolean'
    },
    ghCodeBlocks: {
      default: true,
      describe: 'Turn on/off GFM fenced code blocks support',
      type: 'boolean'
    },
    tasklists: {
      default: false,
      describe: 'Turn on/off GFM tasklist support',
      type: 'boolean'
    },
    smoothLivePreview: {
      default: false,
      describe: 'Prevents weird effects in live previews due to incomplete input',
      type: 'boolean'
    }
  };
  if (simple === false) {
    return JSON.parse(JSON.stringify(defaultOptions));
  }
  var ret = {};
  for (var opt in defaultOptions) {
    if (defaultOptions.hasOwnProperty(opt)) {
      ret[opt] = defaultOptions[opt].default;
    }
  }
  return ret;
}

/**
 * Created by Tivie on 06-01-2015.
 */

// Private properties
var showdown = {},
    parsers = {},
    extensions = {},
    globalOptions = getDefaultOpts(true),
    flavor = {
      github: {
        omitExtraWLInCodeBlocks:   true,
        prefixHeaderId:            'user-content-',
        simplifiedAutoLink:        true,
        literalMidWordUnderscores: true,
        strikethrough:             true,
        tables:                    true,
        tablesHeaderId:            true,
        ghCodeBlocks:              true,
        tasklists:                 true
      },
      vanilla: getDefaultOpts(true)
    };

/**
 * helper namespace
 * @type {{}}
 */
showdown.helper = {};

/**
 * TODO LEGACY SUPPORT CODE
 * @type {{}}
 */
showdown.extensions = {};

/**
 * Set a global option
 * @static
 * @param {string} key
 * @param {*} value
 * @returns {showdown}
 */
showdown.setOption = function (key, value) {
  'use strict';
  globalOptions[key] = value;
  return this;
};

/**
 * Get a global option
 * @static
 * @param {string} key
 * @returns {*}
 */
showdown.getOption = function (key) {
  'use strict';
  return globalOptions[key];
};

/**
 * Get the global options
 * @static
 * @returns {{}}
 */
showdown.getOptions = function () {
  'use strict';
  return globalOptions;
};

/**
 * Reset global options to the default values
 * @static
 */
showdown.resetOptions = function () {
  'use strict';
  globalOptions = getDefaultOpts(true);
};

/**
 * Set the flavor showdown should use as default
 * @param {string} name
 */
showdown.setFlavor = function (name) {
  'use strict';
  if (flavor.hasOwnProperty(name)) {
    var preset = flavor[name];
    for (var option in preset) {
      if (preset.hasOwnProperty(option)) {
        globalOptions[option] = preset[option];
      }
    }
  }
};

/**
 * Get the default options
 * @static
 * @param {boolean} [simple=true]
 * @returns {{}}
 */
showdown.getDefaultOptions = function (simple) {
  'use strict';
  return getDefaultOpts(simple);
};

/**
 * Get or set a subParser
 *
 * subParser(name)       - Get a registered subParser
 * subParser(name, func) - Register a subParser
 * @static
 * @param {string} name
 * @param {function} [func]
 * @returns {*}
 */
showdown.subParser = function (name, func) {
  'use strict';
  if (showdown.helper.isString(name)) {
    if (typeof func !== 'undefined') {
      parsers[name] = func;
    } else {
      if (parsers.hasOwnProperty(name)) {
        return parsers[name];
      } else {
        throw Error('SubParser named ' + name + ' not registered!');
      }
    }
  }
};

/**
 * Gets or registers an extension
 * @static
 * @param {string} name
 * @param {object|function=} ext
 * @returns {*}
 */
showdown.extension = function (name, ext) {
  'use strict';

  if (!showdown.helper.isString(name)) {
    throw Error('Extension \'name\' must be a string');
  }

  name = showdown.helper.stdExtName(name);

  // Getter
  if (showdown.helper.isUndefined(ext)) {
    if (!extensions.hasOwnProperty(name)) {
      throw Error('Extension named ' + name + ' is not registered!');
    }
    return extensions[name];

    // Setter
  } else {
    // Expand extension if it's wrapped in a function
    if (typeof ext === 'function') {
      ext = ext();
    }

    // Ensure extension is an array
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExtension = validate(ext, name);

    if (validExtension.valid) {
      extensions[name] = ext;
    } else {
      throw Error(validExtension.error);
    }
  }
};

/**
 * Gets all extensions registered
 * @returns {{}}
 */
showdown.getAllExtensions = function () {
  'use strict';
  return extensions;
};

/**
 * Remove an extension
 * @param {string} name
 */
showdown.removeExtension = function (name) {
  'use strict';
  delete extensions[name];
};

/**
 * Removes all extensions
 */
showdown.resetExtensions = function () {
  'use strict';
  extensions = {};
};

/**
 * Validate extension
 * @param {array} extension
 * @param {string} name
 * @returns {{valid: boolean, error: string}}
 */
function validate(extension, name) {
  'use strict';

  var errMsg = (name) ? 'Error in ' + name + ' extension->' : 'Error in unnamed extension',
    ret = {
      valid: true,
      error: ''
    };

  if (!showdown.helper.isArray(extension)) {
    extension = [extension];
  }

  for (var i = 0; i < extension.length; ++i) {
    var baseMsg = errMsg + ' sub-extension ' + i + ': ',
        ext = extension[i];
    if (typeof ext !== 'object') {
      ret.valid = false;
      ret.error = baseMsg + 'must be an object, but ' + typeof ext + ' given';
      return ret;
    }

    if (!showdown.helper.isString(ext.type)) {
      ret.valid = false;
      ret.error = baseMsg + 'property "type" must be a string, but ' + typeof ext.type + ' given';
      return ret;
    }

    var type = ext.type = ext.type.toLowerCase();

    // normalize extension type
    if (type === 'language') {
      type = ext.type = 'lang';
    }

    if (type === 'html') {
      type = ext.type = 'output';
    }

    if (type !== 'lang' && type !== 'output') {
      ret.valid = false;
      ret.error = baseMsg + 'type ' + type + ' is not recognized. Valid values: "lang" or "output"';
      return ret;
    }

    if (ext.filter) {
      if (typeof ext.filter !== 'function') {
        ret.valid = false;
        ret.error = baseMsg + '"filter" must be a function, but ' + typeof ext.filter + ' given';
        return ret;
      }

    } else if (ext.regex) {
      if (showdown.helper.isString(ext.regex)) {
        ext.regex = new RegExp(ext.regex, 'g');
      }
      if (!ext.regex instanceof RegExp) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" property must either be a string or a RegExp object, but ' +
          typeof ext.regex + ' given';
        return ret;
      }
      if (showdown.helper.isUndefined(ext.replace)) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" extensions must implement a replace string or function';
        return ret;
      }

    } else {
      ret.valid = false;
      ret.error = baseMsg + 'extensions must define either a "regex" property or a "filter" method';
      return ret;
    }

    if (showdown.helper.isUndefined(ext.filter) && showdown.helper.isUndefined(ext.regex)) {
      ret.valid = false;
      ret.error = baseMsg + 'output extensions must define a filter property';
      return ret;
    }
  }
  return ret;
}

/**
 * Validate extension
 * @param {object} ext
 * @returns {boolean}
 */
showdown.validateExtension = function (ext) {
  'use strict';

  var validateExtension = validate(ext, null);
  if (!validateExtension.valid) {
    console.warn(validateExtension.error);
    return false;
  }
  return true;
};

/**
 * showdownjs helper functions
 */

if (!showdown.hasOwnProperty('helper')) {
  showdown.helper = {};
}

/**
 * Check if var is string
 * @static
 * @param {string} a
 * @returns {boolean}
 */
showdown.helper.isString = function isString(a) {
  'use strict';
  return (typeof a === 'string' || a instanceof String);
};

/**
 * ForEach helper function
 * @static
 * @param {*} obj
 * @param {function} callback
 */
showdown.helper.forEach = function forEach(obj, callback) {
  'use strict';
  if (typeof obj.forEach === 'function') {
    obj.forEach(callback);
  } else {
    for (var i = 0; i < obj.length; i++) {
      callback(obj[i], i, obj);
    }
  }
};

/**
 * isArray helper function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isArray = function isArray(a) {
  'use strict';
  return a.constructor === Array;
};

/**
 * Check if value is undefined
 * @static
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 */
showdown.helper.isUndefined = function isUndefined(value) {
  'use strict';
  return typeof value === 'undefined';
};

/**
 * Standardidize extension name
 * @static
 * @param {string} s extension name
 * @returns {string}
 */
showdown.helper.stdExtName = function (s) {
  'use strict';
  return s.replace(/[_-]||\s/g, '').toLowerCase();
};

function escapeCharactersCallback(wholeMatch, m1) {
  'use strict';
  var charCodeToEscape = m1.charCodeAt(0);
  return '~E' + charCodeToEscape + 'E';
}

/**
 * Callback used to escape characters when passing through String.replace
 * @static
 * @param {string} wholeMatch
 * @param {string} m1
 * @returns {string}
 */
showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

/**
 * Escape characters in a string
 * @static
 * @param {string} text
 * @param {string} charsToEscape
 * @param {boolean} afterBackslash
 * @returns {XML|string|void|*}
 */
showdown.helper.escapeCharacters = function escapeCharacters(text, charsToEscape, afterBackslash) {
  'use strict';
  // First we have to escape the escape characters so that
  // we can build a character class out of them
  var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';

  if (afterBackslash) {
    regexString = '\\\\' + regexString;
  }

  var regex = new RegExp(regexString, 'g');
  text = text.replace(regex, escapeCharactersCallback);

  return text;
};

/**
 * POLYFILLS
 */
if (showdown.helper.isUndefined(console)) {
  console = {
    warn: function (msg) {
      'use strict';
      alert(msg);
    },
    log: function (msg) {
      'use strict';
      alert(msg);
    }
  };
}

/**
 * Created by Estevao on 31-05-2015.
 */

/**
 * Showdown Converter class
 * @class
 * @param {object} [converterOptions]
 * @returns {Converter}
 */
showdown.Converter = function (converterOptions) {
  'use strict';

  var
      /**
       * Options used by this converter
       * @private
       * @type {{}}
       */
      options = {},

      /**
       * Language extensions used by this converter
       * @private
       * @type {Array}
       */
      langExtensions = [],

      /**
       * Output modifiers extensions used by this converter
       * @private
       * @type {Array}
       */
      outputModifiers = [],

      /**
       * The parser Order
       * @private
       * @type {string[]}
       */
      parserOrder = [
        'githubCodeBlocks',
        'hashHTMLBlocks',
        'stripLinkDefinitions',
        'blockGamut',
        'unescapeSpecialChars'
      ];

  _constructor();

  /**
   * Converter constructor
   * @private
   */
  function _constructor() {
    converterOptions = converterOptions || {};

    for (var gOpt in globalOptions) {
      if (globalOptions.hasOwnProperty(gOpt)) {
        options[gOpt] = globalOptions[gOpt];
      }
    }

    // Merge options
    if (typeof converterOptions === 'object') {
      for (var opt in converterOptions) {
        if (converterOptions.hasOwnProperty(opt)) {
          options[opt] = converterOptions[opt];
        }
      }
    } else {
      throw Error('Converter expects the passed parameter to be an object, but ' + typeof converterOptions +
      ' was passed instead.');
    }

    if (options.extensions) {
      showdown.helper.forEach(options.extensions, _parseExtension);
    }
  }

  /**
   * Parse extension
   * @param {*} ext
   * @param {string} [name='']
   * @private
   */
  function _parseExtension(ext, name) {

    name = name || null;
    // If it's a string, the extension was previously loaded
    if (showdown.helper.isString(ext)) {
      ext = showdown.helper.stdExtName(ext);
      name = ext;

      // LEGACY_SUPPORT CODE
      if (showdown.extensions[ext]) {
        console.warn('DEPRECATION WARNING: ' + ext + ' is an old extension that uses a deprecated loading method.' +
          'Please inform the developer that the extension should be updated!');
        legacyExtensionLoading(showdown.extensions[ext], ext);
        return;
      // END LEGACY SUPPORT CODE

      } else if (!showdown.helper.isUndefined(extensions[ext])) {
        ext = extensions[ext];

      } else {
        throw Error('Extension "' + ext + '" could not be loaded. It was either not found or is not a valid extension.');
      }
    }

    if (typeof ext === 'function') {
      ext = ext();
    }

    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExt = validate(ext, name);
    if (!validExt.valid) {
      throw Error(validExt.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {
        case 'lang':
          langExtensions.push(ext[i]);
          break;

        case 'output':
          outputModifiers.push(ext[i]);
          break;

        default:
          // should never reach here
          throw Error('Extension loader error: Type unrecognized!!!');
      }
    }
  }

  /**
   * LEGACY_SUPPORT
   * @param {*} ext
   * @param {string} name
   */
  function legacyExtensionLoading(ext, name) {
    if (typeof ext === 'function') {
      ext = ext(new showdown.Converter());
    }
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }
    var valid = validate(ext, name);

    if (!valid.valid) {
      throw Error(valid.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {
        case 'lang':
          langExtensions.push(ext[i]);
          break;
        case 'output':
          outputModifiers.push(ext[i]);
          break;
        default:// should never reach here
          throw Error('Extension loader error: Type unrecognized!!!');
      }
    }
  }

  /**
   * Converts a markdown string into HTML
   * @param {string} text
   * @returns {*}
   */
  this.makeHtml = function (text) {
    //check if text is not falsy
    if (!text) {
      return text;
    }

    var globals = {
      gHtmlBlocks:     [],
      gUrls:           {},
      gTitles:         {},
      gDimensions:     {},
      gListLevel:      0,
      hashLinkCounts:  {},
      langExtensions:  langExtensions,
      outputModifiers: outputModifiers,
      converter:       this
    };

    // attacklab: Replace ~ with ~T
    // This lets us use tilde as an escape char to avoid md5 hashes
    // The choice of character is arbitrary; anything that isn't
    // magic in Markdown will work.
    text = text.replace(/~/g, '~T');

    // attacklab: Replace $ with ~D
    // RegExp interprets $ as a special character
    // when it's in a replacement string
    text = text.replace(/\$/g, '~D');

    // Standardize line endings
    text = text.replace(/\r\n/g, '\n'); // DOS to Unix
    text = text.replace(/\r/g, '\n'); // Mac to Unix

    // Make sure text begins and ends with a couple of newlines:
    text = '\n\n' + text + '\n\n';

    // detab
    text = showdown.subParser('detab')(text, options, globals);

    // stripBlankLines
    text = showdown.subParser('stripBlankLines')(text, options, globals);

    //run languageExtensions
    showdown.helper.forEach(langExtensions, function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    });

    // Run all registered parsers
    for (var i = 0; i < parserOrder.length; ++i) {
      var name = parserOrder[i];
      text = parsers[name](text, options, globals);
    }

    // attacklab: Restore dollar signs
    text = text.replace(/~D/g, '$$');

    // attacklab: Restore tildes
    text = text.replace(/~T/g, '~');

    // Run output modifiers
    showdown.helper.forEach(outputModifiers, function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    });

    return text;
  };

  /**
   * Set an option of this Converter instance
   * @param {string} key
   * @param {*} value
   */
  this.setOption = function (key, value) {
    options[key] = value;
  };

  /**
   * Get the option of this Converter instance
   * @param {string} key
   * @returns {*}
   */
  this.getOption = function (key) {
    return options[key];
  };

  /**
   * Get the options of this Converter instance
   * @returns {{}}
   */
  this.getOptions = function () {
    return options;
  };

  /**
   * Add extension to THIS converter
   * @param {{}} extension
   * @param {string} [name=null]
   */
  this.addExtension = function (extension, name) {
    name = name || null;
    _parseExtension(extension, name);
  };

  /**
   * Use a global registered extension with THIS converter
   * @param {string} extensionName Name of the previously registered extension
   */
  this.useExtension = function (extensionName) {
    _parseExtension(extensionName);
  };

  /**
   * Set the flavor THIS converter should use
   * @param {string} name
   */
  this.setFlavor = function (name) {
    if (flavor.hasOwnProperty(name)) {
      var preset = flavor[name];
      for (var option in preset) {
        if (preset.hasOwnProperty(option)) {
          options[option] = preset[option];
        }
      }
    }
  };

  /**
   * Remove an extension from THIS converter.
   * Note: This is a costly operation. It's better to initialize a new converter
   * and specify the extensions you wish to use
   * @param {Array} extension
   */
  this.removeExtension = function (extension) {
    if (!showdown.helper.isArray(extension)) {
      extension = [extension];
    }
    for (var a = 0; a < extension.length; ++a) {
      var ext = extension[a];
      for (var i = 0; i < langExtensions.length; ++i) {
        if (langExtensions[i] === ext) {
          langExtensions[i].splice(i, 1);
        }
      }
      for (var ii = 0; ii < outputModifiers.length; ++i) {
        if (outputModifiers[ii] === ext) {
          outputModifiers[ii].splice(i, 1);
        }
      }
    }
  };

  /**
   * Get all extension of THIS converter
   * @returns {{language: Array, output: Array}}
   */
  this.getAllExtensions = function () {
    return {
      language: langExtensions,
      output: outputModifiers
    };
  };
};

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('anchors', function (text, config, globals) {
  'use strict';

  var writeAnchorTag = function (wholeMatch, m1, m2, m3, m4, m5, m6, m7) {
    if (showdown.helper.isUndefined(m7)) {
      m7 = '';
    }
    wholeMatch = m1;
    var linkText = m2,
        linkId = m3.toLowerCase(),
        url = m4,
        title = m7;

    if (!url) {
      if (!linkId) {
        // lower-case and turn embedded newlines into spaces
        linkId = linkText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(globals.gUrls[linkId])) {
        url = globals.gUrls[linkId];
        if (!showdown.helper.isUndefined(globals.gTitles[linkId])) {
          title = globals.gTitles[linkId];
        }
      } else {
        if (wholeMatch.search(/\(\s*\)$/m) > -1) {
          // Special case for explicit empty url
          url = '';
        } else {
          return wholeMatch;
        }
      }
    }

    url = showdown.helper.escapeCharacters(url, '*_', false);
    var result = '<a href="' + url + '"';

    if (title !== '' && title !== null) {
      title = title.replace(/"/g, '&quot;');
      title = showdown.helper.escapeCharacters(title, '*_', false);
      result += ' title="' + title + '"';
    }

    result += '>' + linkText + '</a>';

    return result;
  };

  // First, handle reference-style links: [link text] [id]
  /*
   text = text.replace(/
   (							// wrap whole match in $1
   \[
   (
   (?:
   \[[^\]]*\]		// allow brackets nested one level
   |
   [^\[]			// or anything else
   )*
   )
   \]

   [ ]?					// one optional space
   (?:\n[ ]*)?				// one optional newline followed by spaces

   \[
   (.*?)					// id = $3
   \]
   )()()()()					// pad remaining backreferences
   /g,_DoAnchors_callback);
   */
  text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, writeAnchorTag);

  //
  // Next, inline-style links: [link text](url "optional title")
  //

  /*
   text = text.replace(/
   (						// wrap whole match in $1
   \[
   (
   (?:
   \[[^\]]*\]	// allow brackets nested one level
   |
   [^\[\]]			// or anything else
   )
   )
   \]
   \(						// literal paren
   [ \t]*
   ()						// no id, so leave $3 empty
   <?(.*?)>?				// href = $4
   [ \t]*
   (						// $5
   (['"])				// quote char = $6
   (.*?)				// Title = $7
   \6					// matching quote
   [ \t]*				// ignore any spaces/tabs between closing quote and )
   )?						// title is optional
   \)
   )
   /g,writeAnchorTag);
   */
  text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
                      writeAnchorTag);

  //
  // Last, handle reference-style shortcuts: [link text]
  // These must come last in case you've also got [link test][1]
  // or [link test](/foo)
  //

  /*
   text = text.replace(/
   (                // wrap whole match in $1
   \[
   ([^\[\]]+)       // link text = $2; can't contain '[' or ']'
   \]
   )()()()()()      // pad rest of backreferences
   /g, writeAnchorTag);
   */
  text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);

  return text;

});

showdown.subParser('autoLinks', function (text, options) {
  'use strict';

  //simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[-.+~:?#@!$&'()*,;=[\]\w]+)\b/gi,

  var simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)(?=\s|$)(?!["<>])/gi,
      delimUrlRegex   = /<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)>/gi,
      simpleMailRegex = /\b(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)\b/gi,
      delimMailRegex  = /<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;

  text = text.replace(delimUrlRegex, '<a href=\"$1\">$1</a>');
  text = text.replace(delimMailRegex, replaceMail);
  //simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[-.+~:?#@!$&'()*,;=[\]\w]+)\b/gi,
  // Email addresses: <address@domain.foo>

  if (options.simplifiedAutoLink) {
    text = text.replace(simpleURLRegex, '<a href=\"$1\">$1</a>');
    text = text.replace(simpleMailRegex, replaceMail);
  }

  function replaceMail(wholeMatch, m1) {
    var unescapedStr = showdown.subParser('unescapeSpecialChars')(m1);
    return showdown.subParser('encodeEmailAddress')(unescapedStr);
  }

  return text;
});

/**
 * These are all the transformations that form block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('blockGamut', function (text, options, globals) {
  'use strict';

  // we parse blockquotes first so that we can have headings and hrs
  // inside blockquotes
  text = showdown.subParser('blockQuotes')(text, options, globals);
  text = showdown.subParser('headers')(text, options, globals);

  // Do Horizontal Rules:
  var key = showdown.subParser('hashBlock')('<hr />', options, globals);
  text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, key);
  text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, key);
  text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, key);

  text = showdown.subParser('lists')(text, options, globals);
  text = showdown.subParser('codeBlocks')(text, options, globals);
  text = showdown.subParser('tables')(text, options, globals);

  // We already ran _HashHTMLBlocks() before, in Markdown(), but that
  // was to escape raw HTML in the original Markdown source. This time,
  // we're escaping the markup we've just created, so that we don't wrap
  // <p> tags around block-level tags.
  text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
  text = showdown.subParser('paragraphs')(text, options, globals);

  return text;

});

showdown.subParser('blockQuotes', function (text, options, globals) {
  'use strict';

  /*
   text = text.replace(/
   (								// Wrap whole match in $1
   (
   ^[ \t]*>[ \t]?			// '>' at the start of a line
   .+\n					// rest of the first line
   (.+\n)*					// subsequent consecutive lines
   \n*						// blanks
   )+
   )
   /gm, function(){...});
   */

  text = text.replace(/((^[ \t]{0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, function (wholeMatch, m1) {
    var bq = m1;

    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g,"") == "bug"
    bq = bq.replace(/^[ \t]*>[ \t]?/gm, '~0'); // trim one level of quoting

    // attacklab: clean up hack
    bq = bq.replace(/~0/g, '');

    bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
    bq = showdown.subParser('githubCodeBlocks')(bq, options, globals);
    bq = showdown.subParser('blockGamut')(bq, options, globals); // recurse

    bq = bq.replace(/(^|\n)/g, '$1  ');
    // These leading spaces screw with <pre> content, so we need to fix that:
    bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
      var pre = m1;
      // attacklab: hack around Konqueror 3.5.4 bug:
      pre = pre.replace(/^  /mg, '~0');
      pre = pre.replace(/~0/g, '');
      return pre;
    });

    return showdown.subParser('hashBlock')('<blockquote>\n' + bq + '\n</blockquote>', options, globals);
  });
  return text;
});

/**
 * Process Markdown `<pre><code>` blocks.
 */
showdown.subParser('codeBlocks', function (text, options, globals) {
  'use strict';

  /*
   text = text.replace(text,
   /(?:\n\n|^)
   (								// $1 = the code block -- one or more lines, starting with a space/tab
   (?:
   (?:[ ]{4}|\t)			// Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
   .*\n+
   )+
   )
   (\n*[ ]{0,3}[^ \t\n]|(?=~0))	// attacklab: g_tab_width
   /g,function(){...});
   */

  // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '~0';

  var pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
  text = text.replace(pattern, function (wholeMatch, m1, m2) {
    var codeblock = m1,
        nextChar = m2,
        end = '\n';

    codeblock = showdown.subParser('outdent')(codeblock);
    codeblock = showdown.subParser('encodeCode')(codeblock);
    codeblock = showdown.subParser('detab')(codeblock);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing newlines

    if (options.omitExtraWLInCodeBlocks) {
      end = '';
    }

    codeblock = '<pre><code>' + codeblock + end + '</code></pre>';

    return showdown.subParser('hashBlock')(codeblock, options, globals) + nextChar;
  });

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;
});

/**
 *
 *   *  Backtick quotes are used for <code></code> spans.
 *
 *   *  You can use multiple backticks as the delimiters if you want to
 *     include literal backticks in the code span. So, this input:
 *
 *         Just type ``foo `bar` baz`` at the prompt.
 *
 *       Will translate to:
 *
 *         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
 *
 *    There's no arbitrary limit to the number of backticks you
 *    can use as delimters. If you need three consecutive backticks
 *    in your code, use four for delimiters, etc.
 *
 *  *  You can use spaces to get literal backticks at the edges:
 *
 *         ... type `` `bar` `` ...
 *
 *       Turns to:
 *
 *         ... type <code>`bar`</code> ...
 */
showdown.subParser('codeSpans', function (text) {
  'use strict';

  //special case -> literal html code tag
  text = text.replace(/(<code[^><]*?>)([^]*?)<\/code>/g, function (wholeMatch, tag, c) {
    c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
    c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
    c = showdown.subParser('encodeCode')(c);
    return tag + c + '</code>';
  });

  /*
   text = text.replace(/
   (^|[^\\])					// Character before opening ` can't be a backslash
   (`+)						// $2 = Opening run of `
   (							// $3 = The code block
   [^\r]*?
   [^`]					// attacklab: work around lack of lookbehind
   )
   \2							// Matching closer
   (?!`)
   /gm, function(){...});
   */
  text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
    function (wholeMatch, m1, m2, m3) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
      c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
      c = showdown.subParser('encodeCode')(c);
      return m1 + '<code>' + c + '</code>';
    }
  );

  return text;
});

/**
 * Convert all tabs to spaces
 */
showdown.subParser('detab', function (text) {
  'use strict';

  // expand first n-1 tabs
  text = text.replace(/\t(?=\t)/g, '    '); // g_tab_width

  // replace the nth with two sentinels
  text = text.replace(/\t/g, '~A~B');

  // use the sentinel to anchor our regex so it doesn't explode
  text = text.replace(/~B(.+?)~A/g, function (wholeMatch, m1) {
    var leadingText = m1,
        numSpaces = 4 - leadingText.length % 4;  // g_tab_width

    // there *must* be a better way to do this:
    for (var i = 0; i < numSpaces; i++) {
      leadingText += ' ';
    }

    return leadingText;
  });

  // clean up sentinels
  text = text.replace(/~A/g, '    ');  // g_tab_width
  text = text.replace(/~B/g, '');

  return text;

});

/**
 * Smart processing for ampersands and angle brackets that need to be encoded.
 */
showdown.subParser('encodeAmpsAndAngles', function (text) {
  'use strict';
  // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
  // http://bumppo.net/projects/amputator/
  text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');

  // Encode naked <'s
  text = text.replace(/<(?![a-z\/?\$!])/gi, '&lt;');

  return text;
});

/**
 * Returns the string, with after processing the following backslash escape sequences.
 *
 * attacklab: The polite way to do this is with the new escapeCharacters() function:
 *
 *    text = escapeCharacters(text,"\\",true);
 *    text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
 *
 * ...but we're sidestepping its use of the (slow) RegExp constructor
 * as an optimization for Firefox.  This function gets called a LOT.
 */
showdown.subParser('encodeBackslashEscapes', function (text) {
  'use strict';
  text = text.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
  text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, showdown.helper.escapeCharactersCallback);
  return text;
});

/**
 * Encode/escape certain characters inside Markdown code runs.
 * The point is that in code, these characters are literals,
 * and lose their special Markdown meanings.
 */
showdown.subParser('encodeCode', function (text) {
  'use strict';

  // Encode all ampersands; HTML entities are not
  // entities within a Markdown code span.
  text = text.replace(/&/g, '&amp;');

  // Do the angle bracket song and dance:
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');

  // Now, escape characters that are magic in Markdown:
  text = showdown.helper.escapeCharacters(text, '*_{}[]\\', false);

  // jj the line above breaks this:
  //---
  //* Item
  //   1. Subitem
  //            special char: *
  // ---

  return text;
});

/**
 *  Input: an email address, e.g. "foo@example.com"
 *
 *  Output: the email address as a mailto link, with each character
 *    of the address encoded as either a decimal or hex entity, in
 *    the hopes of foiling most address harvesting spam bots. E.g.:
 *
 *    <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
 *       x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
 *       &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
 *
 *  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
 *  mailing list: <http://tinyurl.com/yu7ue>
 *
 */
showdown.subParser('encodeEmailAddress', function (addr) {
  'use strict';

  var encode = [
    function (ch) {
      return '&#' + ch.charCodeAt(0) + ';';
    },
    function (ch) {
      return '&#x' + ch.charCodeAt(0).toString(16) + ';';
    },
    function (ch) {
      return ch;
    }
  ];

  addr = 'mailto:' + addr;

  addr = addr.replace(/./g, function (ch) {
    if (ch === '@') {
      // this *must* be encoded. I insist.
      ch = encode[Math.floor(Math.random() * 2)](ch);
    } else if (ch !== ':') {
      // leave ':' alone (to spot mailto: later)
      var r = Math.random();
      // roughly 10% raw, 45% hex, 45% dec
      ch = (
        r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch)
      );
    }
    return ch;
  });

  addr = '<a href="' + addr + '">' + addr + '</a>';
  addr = addr.replace(/">.+:/g, '">'); // strip the mailto: from the visible part

  return addr;
});

/**
 * Within tags -- meaning between < and > -- encode [\ ` * _] so they
 * don't conflict with their use in Markdown for code, italics and strong.
 */
showdown.subParser('escapeSpecialCharsWithinTagAttributes', function (text) {
  'use strict';

  // Build a regex to find HTML tags and comments.  See Friedl's
  // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
  var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

  text = text.replace(regex, function (wholeMatch) {
    var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g, '$1`');
    tag = showdown.helper.escapeCharacters(tag, '\\`*_', false);
    return tag;
  });

  return text;
});

/**
 * Handle github codeblocks prior to running HashHTML so that
 * HTML contained within the codeblock gets escaped properly
 * Example:
 * ```ruby
 *     def hello_world(x)
 *       puts "Hello, #{x}"
 *     end
 * ```
 */
showdown.subParser('githubCodeBlocks', function (text, options, globals) {
  'use strict';

  // early exit if option is not enabled
  if (!options.ghCodeBlocks) {
    return text;
  }

  text += '~0';

  text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function (wholeMatch, language, codeblock) {
    var end = (options.omitExtraWLInCodeBlocks) ? '' : '\n';

    codeblock = showdown.subParser('encodeCode')(codeblock);
    codeblock = showdown.subParser('detab')(codeblock);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

    codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

    return showdown.subParser('hashBlock')(codeblock, options, globals);
  });

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;

});

showdown.subParser('hashBlock', function (text, options, globals) {
  'use strict';
  text = text.replace(/(^\n+|\n+$)/g, '');
  return '\n\n~K' + (globals.gHtmlBlocks.push(text) - 1) + 'K\n\n';
});

showdown.subParser('hashElement', function (text, options, globals) {
  'use strict';

  return function (wholeMatch, m1) {
    var blockText = m1;

    // Undo double lines
    blockText = blockText.replace(/\n\n/g, '\n');
    blockText = blockText.replace(/^\n/, '');

    // strip trailing blank lines
    blockText = blockText.replace(/\n+$/g, '');

    // Replace the element text with a marker ("~KxK" where x is its key)
    blockText = '\n\n~K' + (globals.gHtmlBlocks.push(blockText) - 1) + 'K\n\n';

    return blockText;
  };
});

showdown.subParser('hashHTMLBlocks', function (text, options, globals) {
  'use strict';

  // attacklab: Double up blank lines to reduce lookaround
  text = text.replace(/\n/g, '\n\n');

  // Hashify HTML blocks:
  // We only want to do this for block-level HTML tags, such as headers,
  // lists, and tables. That's because we still want to wrap <p>s around
  // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
  // phrase emphasis, and spans. The list of tags we're looking for is
  // hard-coded:
  //var block_tags_a =
  // 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|style|section|header|footer|nav|article|aside';
  // var block_tags_b =
  // 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside';

  // First, look for nested blocks, e.g.:
  //   <div>
  //     <div>
  //     tags for inner block must be indented.
  //     </div>
  //   </div>
  //
  // The outermost tags must start at the left margin for this to match, and
  // the inner nested divs must be indented.
  // We need to do this before the next, more liberal match, because the next
  // match will start at the first `<div>` and stop at the first `</div>`.

  // attacklab: This regex can be expensive when it fails.
  /*
   var text = text.replace(/
   (						// save in $1
   ^					// start of line  (with /m)
   <($block_tags_a)	// start tag = $2
   \b					// word break
   // attacklab: hack around khtml/pcre bug...
   [^\r]*?\n			// any number of lines, minimally matching
   </\2>				// the matching end tag
   [ \t]*				// trailing spaces/tabs
   (?=\n+)				// followed by a newline
   )						// attacklab: there are sentinel newlines at end of document
   /gm,function(){...}};
   */
  text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,
                      showdown.subParser('hashElement')(text, options, globals));

  //
  // Now match more liberally, simply from `\n<tag>` to `</tag>\n`
  //

  /*
   var text = text.replace(/
   (						// save in $1
   ^					// start of line  (with /m)
   <($block_tags_b)	// start tag = $2
   \b					// word break
   // attacklab: hack around khtml/pcre bug...
   [^\r]*?				// any number of lines, minimally matching
   </\2>				// the matching end tag
   [ \t]*				// trailing spaces/tabs
   (?=\n+)				// followed by a newline
   )						// attacklab: there are sentinel newlines at end of document
   /gm,function(){...}};
   */
  text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside|address|audio|canvas|figure|hgroup|output|video)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm,
                      showdown.subParser('hashElement')(text, options, globals));

  // Special case just for <hr />. It was easier to make a special case than
  // to make the other regex more complicated.

  /*
   text = text.replace(/
   (						// save in $1
   \n\n				// Starting after a blank line
   [ ]{0,3}
   (<(hr)				// start tag = $2
   \b					// word break
   ([^<>])*?			//
   \/?>)				// the matching end tag
   [ \t]*
   (?=\n{2,})			// followed by a blank line
   )
   /g,showdown.subParser('hashElement')(text, options, globals));
   */
  text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
                      showdown.subParser('hashElement')(text, options, globals));

  // Special case for standalone HTML comments:

  /*
   text = text.replace(/
   (						// save in $1
   \n\n				// Starting after a blank line
   [ ]{0,3}			// attacklab: g_tab_width - 1
   <!
   (--[^\r]*?--\s*)+
   >
   [ \t]*
   (?=\n{2,})			// followed by a blank line
   )
   /g,showdown.subParser('hashElement')(text, options, globals));
   */
  text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,
                      showdown.subParser('hashElement')(text, options, globals));

  // PHP and ASP-style processor instructions (<?...?> and <%...%>)

  /*
   text = text.replace(/
   (?:
   \n\n				// Starting after a blank line
   )
   (						// save in $1
   [ ]{0,3}			// attacklab: g_tab_width - 1
   (?:
   <([?%])			// $2
   [^\r]*?
   \2>
   )
   [ \t]*
   (?=\n{2,})			// followed by a blank line
   )
   /g,showdown.subParser('hashElement')(text, options, globals));
   */
  text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
                      showdown.subParser('hashElement')(text, options, globals));

  // attacklab: Undo double lines (see comment at top of this function)
  text = text.replace(/\n\n/g, '\n');
  return text;

});

showdown.subParser('headers', function (text, options, globals) {
  'use strict';

  var prefixHeader = options.prefixHeaderId,
      headerLevelStart = (isNaN(parseInt(options.headerLevelStart))) ? 1 : parseInt(options.headerLevelStart),

  // Set text-style headers:
  //	Header 1
  //	========
  //
  //	Header 2
  //	--------
  //
      setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

  text = text.replace(setextRegexH1, function (wholeMatch, m1) {

    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart,
        hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  text = text.replace(setextRegexH2, function (matchFound, m1) {
    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart + 1,
      hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  // atx-style headers:
  //  # Header 1
  //  ## Header 2
  //  ## Header 2 with closing hashes ##
  //  ...
  //  ###### Header 6
  //
  text = text.replace(/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm, function (wholeMatch, m1, m2) {
    var span = showdown.subParser('spanGamut')(m2, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m2) + '"',
        hLevel = headerLevelStart - 1 + m1.length,
        header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

    return showdown.subParser('hashBlock')(header, options, globals);
  });

  function headerId(m) {
    var title, escapedId = m.replace(/[^\w]/g, '').toLowerCase();

    if (globals.hashLinkCounts[escapedId]) {
      title = escapedId + '-' + (globals.hashLinkCounts[escapedId]++);
    } else {
      title = escapedId;
      globals.hashLinkCounts[escapedId] = 1;
    }

    // Prefix id to prevent causing inadvertent pre-existing style matches.
    if (prefixHeader === true) {
      prefixHeader = 'section';
    }

    if (showdown.helper.isString(prefixHeader)) {
      return prefixHeader + title;
    }
    return title;
  }

  return text;
});

/**
 * Turn Markdown image shortcuts into <img> tags.
 */
showdown.subParser('images', function (text, options, globals) {
  'use strict';

  var inlineRegExp    = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g,
      referenceRegExp = /!\[(.*?)][ ]?(?:\n[ ]*)?\[(.*?)]()()()()()/g;

  function writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title) {

    var gUrls   = globals.gUrls,
        gTitles = globals.gTitles,
        gDims   = globals.gDimensions;

    linkId = linkId.toLowerCase();

    if (!title) {
      title = '';
    }

    if (url === '' || url === null) {
      if (linkId === '' || linkId === null) {
        // lower-case and turn embedded newlines into spaces
        linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(gUrls[linkId])) {
        url = gUrls[linkId];
        if (!showdown.helper.isUndefined(gTitles[linkId])) {
          title = gTitles[linkId];
        }
        if (!showdown.helper.isUndefined(gDims[linkId])) {
          width = gDims[linkId].width;
          height = gDims[linkId].height;
        }
      } else {
        return wholeMatch;
      }
    }

    altText = altText.replace(/"/g, '&quot;');
    altText = showdown.helper.escapeCharacters(altText, '*_', false);
    url = showdown.helper.escapeCharacters(url, '*_', false);
    var result = '<img src="' + url + '" alt="' + altText + '"';

    if (title) {
      title = title.replace(/"/g, '&quot;');
      title = showdown.helper.escapeCharacters(title, '*_', false);
      result += ' title="' + title + '"';
    }

    if (width && height) {
      width  = (width === '*') ? 'auto' : width;
      height = (height === '*') ? 'auto' : height;

      result += ' width="' + width + '"';
      result += ' height="' + height + '"';
    }

    result += ' />';

    return result;
  }

  // First, handle reference-style labeled images: ![alt text][id]
  text = text.replace(referenceRegExp, writeImageTag);

  // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")
  text = text.replace(inlineRegExp, writeImageTag);

  return text;
});

showdown.subParser('italicsAndBold', function (text, options) {
  'use strict';

  if (options.literalMidWordUnderscores) {
    //underscores
    // Since we are consuming a \s character, we need to add it
    text = text.replace(/(^|\s|>|\b)__(?=\S)([^]+?)__(?=\b|<|\s|$)/gm, '$1<strong>$2</strong>');
    text = text.replace(/(^|\s|>|\b)_(?=\S)([^]+?)_(?=\b|<|\s|$)/gm, '$1<em>$2</em>');
    //asterisks
    text = text.replace(/\*\*(?=\S)([^]+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(?=\S)([^]+?)\*/g, '<em>$1</em>');

  } else {
    // <strong> must go first:
    text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<strong>$2</strong>');
    text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
  }
  return text;
});

/**
 * Form HTML ordered (numbered) and unordered (bulleted) lists.
 */
showdown.subParser('lists', function (text, options, globals) {
  'use strict';

  /**
   * Process the contents of a single ordered or unordered list, splitting it
   * into individual list items.
   * @param {string} listStr
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function processListItems (listStr, trimTrailing) {
    // The $g_list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //    I recommend upgrading to version
    //    8. Oops, now this line is treated
    //    as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".
    globals.gListLevel++;

    // trim trailing blank lines:
    listStr = listStr.replace(/\n{2,}$/, '\n');

    // attacklab: add sentinel to emulate \z
    listStr += '~0';

    var rgx = /(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+((\[(x| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
        isParagraphed = (/\n[ \t]*\n(?!~0)/.test(listStr));

    listStr = listStr.replace(rgx, function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
      checked = (checked && checked.trim() !== '');
      var item = showdown.subParser('outdent')(m4, options, globals),
          bulletStyle = '';

      // Support for github tasklists
      if (taskbtn && options.tasklists) {
        bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
        item = item.replace(/^[ \t]*\[(x| )?]/m, function () {
          var otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
          if (checked) {
            otp += ' checked';
          }
          otp += '>';
          return otp;
        });
      }
      // m1 - Leading line or
      // Has a double return (multi paragraph) or
      // Has sublist
      if (m1 || (item.search(/\n{2,}/) > -1)) {
        item = showdown.subParser('githubCodeBlocks')(item, options, globals);
        item = showdown.subParser('blockGamut')(item, options, globals);
      } else {
        // Recursion for sub-lists:
        item = showdown.subParser('lists')(item, options, globals);
        item = item.replace(/\n$/, ''); // chomp(item)
        if (isParagraphed) {
          item = showdown.subParser('paragraphs')(item, options, globals);
        } else {
          item = showdown.subParser('spanGamut')(item, options, globals);
        }
      }
      item =  '\n<li' + bulletStyle + '>' + item + '</li>\n';
      return item;
    });

    // attacklab: strip sentinel
    listStr = listStr.replace(/~0/g, '');

    globals.gListLevel--;

    if (trimTrailing) {
      listStr = listStr.replace(/\s+$/, '');
    }

    return listStr;
  }

  /**
   * Check and parse consecutive lists (better fix for issue #142)
   * @param {string} list
   * @param {string} listType
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function parseConsecutiveLists(list, listType, trimTrailing) {
    // check if we caught 2 or more consecutive lists by mistake
    // we use the counterRgx, meaning if listType is UL we look for UL and vice versa
    var counterRxg = (listType === 'ul') ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm,
      subLists = [],
      result = '';

    if (list.search(counterRxg) !== -1) {
      (function parseCL(txt) {
        var pos = txt.search(counterRxg);
        if (pos !== -1) {
          // slice
          result += '\n\n<' + listType + '>' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n\n';

          // invert counterType and listType
          listType = (listType === 'ul') ? 'ol' : 'ul';
          counterRxg = (listType === 'ul') ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm;

          //recurse
          parseCL(txt.slice(pos));
        } else {
          result += '\n\n<' + listType + '>' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n\n';
        }
      })(list);
      for (var i = 0; i < subLists.length; ++i) {

      }
    } else {
      result = '\n\n<' + listType + '>' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n\n';
    }

    return result;
  }

  // attacklab: add sentinel to hack around khtml/safari bug:
  // http://bugs.webkit.org/show_bug.cgi?id=11231
  text += '~0';

  // Re-usable pattern to match any entire ul or ol list:
  var wholeList = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

  if (globals.gListLevel) {
    text = text.replace(wholeList, function (wholeMatch, list, m2) {
      var listType = (m2.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
      return parseConsecutiveLists(list, listType, true);
    });
  } else {
    wholeList = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
    //wholeList = /(\n\n|^\n?)( {0,3}([*+-]|\d+\.)[ \t]+[\s\S]+?)(?=(~0)|(\n\n(?!\t| {2,}| {0,3}([*+-]|\d+\.)[ \t])))/g;
    text = text.replace(wholeList, function (wholeMatch, m1, list, m3) {

      var listType = (m3.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
      return parseConsecutiveLists(list, listType);
    });
  }

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;
});

/**
 * Remove one level of line-leading tabs or spaces
 */
showdown.subParser('outdent', function (text) {
  'use strict';

  // attacklab: hack around Konqueror 3.5.4 bug:
  // "----------bug".replace(/^-/g,"") == "bug"
  text = text.replace(/^(\t|[ ]{1,4})/gm, '~0'); // attacklab: g_tab_width

  // attacklab: clean up hack
  text = text.replace(/~0/g, '');

  return text;
});

/**
 *
 */
showdown.subParser('paragraphs', function (text, options, globals) {
  'use strict';

  // Strip leading and trailing lines:
  text = text.replace(/^\n+/g, '');
  text = text.replace(/\n+$/g, '');

  var grafs = text.split(/\n{2,}/g),
      grafsOut = [],
      end = grafs.length; // Wrap <p> tags

  for (var i = 0; i < end; i++) {
    var str = grafs[i];

    // if this is an HTML marker, copy it
    if (str.search(/~K(\d+)K/g) >= 0) {
      grafsOut.push(str);
    } else if (str.search(/\S/) >= 0) {
      str = showdown.subParser('spanGamut')(str, options, globals);
      str = str.replace(/^([ \t]*)/g, '<p>');
      str += '</p>';
      grafsOut.push(str);
    }
  }

  /** Unhashify HTML blocks */
  end = grafsOut.length;
  for (i = 0; i < end; i++) {
    // if this is a marker for an html block...
    while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
      var blockText = globals.gHtmlBlocks[RegExp.$1];
      blockText = blockText.replace(/\$/g, '$$$$'); // Escape any dollar signs
      grafsOut[i] = grafsOut[i].replace(/~K\d+K/, blockText);
    }
  }

  return grafsOut.join('\n\n');
});

/**
 * Run extension
 */
showdown.subParser('runExtension', function (ext, text, options, globals) {
  'use strict';

  if (ext.filter) {
    text = ext.filter(text, globals.converter, options);

  } else if (ext.regex) {
    // TODO remove this when old extension loading mechanism is deprecated
    var re = ext.regex;
    if (!re instanceof RegExp) {
      re = new RegExp(re, 'g');
    }
    text = text.replace(re, ext.replace);
  }

  return text;
});

/**
 * These are all the transformations that occur *within* block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('spanGamut', function (text, options, globals) {
  'use strict';

  text = showdown.subParser('codeSpans')(text, options, globals);
  text = showdown.subParser('escapeSpecialCharsWithinTagAttributes')(text, options, globals);
  text = showdown.subParser('encodeBackslashEscapes')(text, options, globals);

  // Process anchor and image tags. Images must come first,
  // because ![foo][f] looks like an anchor.
  text = showdown.subParser('images')(text, options, globals);
  text = showdown.subParser('anchors')(text, options, globals);

  // Make links out of things like `<http://example.com/>`
  // Must come after _DoAnchors(), because you can use < and >
  // delimiters in inline links like [this](<url>).
  text = showdown.subParser('autoLinks')(text, options, globals);
  text = showdown.subParser('encodeAmpsAndAngles')(text, options, globals);
  text = showdown.subParser('italicsAndBold')(text, options, globals);
  text = showdown.subParser('strikethrough')(text, options, globals);

  // Do hard breaks:
  text = text.replace(/  +\n/g, ' <br />\n');

  return text;

});

showdown.subParser('strikethrough', function (text, options) {
  'use strict';

  if (options.strikethrough) {
    text = text.replace(/(?:~T){2}([^~]+)(?:~T){2}/g, '<del>$1</del>');
  }

  return text;
});

/**
 * Strip any lines consisting only of spaces and tabs.
 * This makes subsequent regexs easier to write, because we can
 * match consecutive blank lines with /\n+/ instead of something
 * contorted like /[ \t]*\n+/
 */
showdown.subParser('stripBlankLines', function (text) {
  'use strict';
  return text.replace(/^[ \t]+$/mg, '');
});

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 * Link defs are in the form: ^[id]: url "optional title"
 *
 * ^[ ]{0,3}\[(.+)\]: // id = $1  attacklab: g_tab_width - 1
 * [ \t]*
 * \n?                  // maybe *one* newline
 * [ \t]*
 * <?(\S+?)>?          // url = $2
 * [ \t]*
 * \n?                // maybe one newline
 * [ \t]*
 * (?:
 * (\n*)              // any lines skipped = $3 attacklab: lookbehind removed
 * ["(]
 * (.+?)              // title = $4
 * [")]
 * [ \t]*
 * )?                 // title is optional
 * (?:\n+|$)
 * /gm,
 * function(){...});
 *
 */
showdown.subParser('stripLinkDefinitions', function (text, options, globals) {
  'use strict';

  var regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;

  // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '~0';

  text = text.replace(regex, function (wholeMatch, linkId, url, width, height, blankLines, title) {
    linkId = linkId.toLowerCase();
    globals.gUrls[linkId] = showdown.subParser('encodeAmpsAndAngles')(url);  // Link IDs are case-insensitive

    if (blankLines) {
      // Oops, found blank lines, so it's not a title.
      // Put back the parenthetical statement we stole.
      return blankLines + title;

    } else {
      if (title) {
        globals.gTitles[linkId] = title.replace(/"|'/g, '&quot;');
      }
      if (options.parseImgDimensions && width && height) {
        globals.gDimensions[linkId] = {
          width:  width,
          height: height
        };
      }
    }
    // Completely remove the definition from the text
    return '';
  });

  // attacklab: strip sentinel
  text = text.replace(/~0/, '');

  return text;
});

showdown.subParser('tables', function (text, options, globals) {
  'use strict';

  var table = function () {

    var tables = {},
        filter;

    tables.th = function (header, style) {
      var id = '';
      header = header.trim();
      if (header === '') {
        return '';
      }
      if (options.tableHeaderId) {
        id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
      }
      header = showdown.subParser('spanGamut')(header, options, globals);
      if (!style || style.trim() === '') {
        style = '';
      } else {
        style = ' style="' + style + '"';
      }
      return '<th' + id + style + '>' + header + '</th>';
    };

    tables.td = function (cell, style) {
      var subText = showdown.subParser('spanGamut')(cell.trim(), options, globals);
      if (!style || style.trim() === '') {
        style = '';
      } else {
        style = ' style="' + style + '"';
      }
      return '<td' + style + '>' + subText + '</td>';
    };

    tables.ths = function () {
      var out = '',
          i = 0,
          hs = [].slice.apply(arguments[0]),
          style = [].slice.apply(arguments[1]);

      for (i; i < hs.length; i += 1) {
        out += tables.th(hs[i], style[i]) + '\n';
      }

      return out;
    };

    tables.tds = function () {
      var out = '',
          i = 0,
          ds = [].slice.apply(arguments[0]),
          style = [].slice.apply(arguments[1]);

      for (i; i < ds.length; i += 1) {
        out += tables.td(ds[i], style[i]) + '\n';
      }
      return out;
    };

    tables.thead = function () {
      var out,
          hs = [].slice.apply(arguments[0]),
          style = [].slice.apply(arguments[1]);

      out = '<thead>\n';
      out += '<tr>\n';
      out += tables.ths.apply(this, [hs, style]);
      out += '</tr>\n';
      out += '</thead>\n';
      return out;
    };

    tables.tr = function () {
      var out,
        cs = [].slice.apply(arguments[0]),
        style = [].slice.apply(arguments[1]);

      out = '<tr>\n';
      out += tables.tds.apply(this, [cs, style]);
      out += '</tr>\n';
      return out;
    };

    filter = function (text) {
      var i = 0,
        lines = text.split('\n'),
        line,
        hs,
        out = [];

      for (i; i < lines.length; i += 1) {
        line = lines[i];
        // looks like a table heading
        if (line.trim().match(/^[|].*[|]$/)) {
          line = line.trim();

          var tbl = [],
              align = lines[i + 1].trim(),
              styles = [],
              j = 0;

          if (align.match(/^[|][-=|: ]+[|]$/)) {
            styles = align.substring(1, align.length - 1).split('|');
            for (j = 0; j < styles.length; ++j) {
              styles[j] = styles[j].trim();
              if (styles[j].match(/^[:][-=| ]+[:]$/)) {
                styles[j] = 'text-align:center;';

              } else if (styles[j].match(/^[-=| ]+[:]$/)) {
                styles[j] = 'text-align:right;';

              } else if (styles[j].match(/^[:][-=| ]+$/)) {
                styles[j] = 'text-align:left;';
              } else {
                styles[j] = '';
              }
            }
          }
          tbl.push('<table>');
          hs = line.substring(1, line.length - 1).split('|');

          if (styles.length === 0) {
            for (j = 0; j < hs.length; ++j) {
              styles.push('text-align:left');
            }
          }
          tbl.push(tables.thead.apply(this, [hs, styles]));
          line = lines[++i];
          if (!line.trim().match(/^[|][-=|: ]+[|]$/)) {
            // not a table rolling back
            line = lines[--i];
          } else {
            line = lines[++i];
            tbl.push('<tbody>');
            while (line.trim().match(/^[|].*[|]$/)) {
              line = line.trim();
              tbl.push(tables.tr.apply(this, [line.substring(1, line.length - 1).split('|'), styles]));
              line = lines[++i];
            }
            tbl.push('</tbody>');
            tbl.push('</table>');
            // we are done with this table and we move along
            out.push(tbl.join('\n'));
            continue;
          }
        }
        out.push(line);
      }
      return out.join('\n');
    };
    return {parse: filter};
  };

  if (options.tables) {
    var tableParser = table();
    return tableParser.parse(text);
  } else {
    return text;
  }
});

/**
 * Swap back in all the special characters we've hidden.
 */
showdown.subParser('unescapeSpecialChars', function (text) {
  'use strict';

  text = text.replace(/~E(\d+)E/g, function (wholeMatch, m1) {
    var charCodeToReplace = parseInt(m1);
    return String.fromCharCode(charCodeToReplace);
  });
  return text;
});

var root = this;

// CommonJS/nodeJS Loader
if (typeof module !== 'undefined' && module.exports) {
  module.exports = showdown;

// AMD Loader
} else if (typeof define === 'function' && define.amd) {
  define('showdown', function () {
    'use strict';
    return showdown;
  });

// Regular Browser loader
} else {
  root.showdown = showdown;
}
}).call(this);
//# sourceMappingURL=showdown.js.map