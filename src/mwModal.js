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
  .service('Modal', function ($rootScope, $templateCache, $document, $compile, $controller, $q, $templateRequest, $timeout, Toast) {

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
  })

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

  .directive('mwModal', function (mwModalTmpl) {
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
  })

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