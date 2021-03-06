(angular => {
    'use strict';

    angular.module('oc.lazyLoad').directive('ocLazyLoad', function($ocLazyLoad, $compile, $animate, $parse) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 1000,
            compile: function(element, attrs) {
                // we store the content and remove it before compilation
                var content = element[0].innerHTML;
                element.html('');

                return function($scope, $element, $attr) {
                    var model = $parse($attr.ocLazyLoad);
                    $scope.$watch(() => {
                        return model($scope) || $attr.ocLazyLoad; // it can be a module name (string), an object, an array, or a scope reference to any of this
                    }, moduleName => {
                        if(angular.isDefined(moduleName)) {
                            $ocLazyLoad.load(moduleName).then(() => {
                                $animate.enter(content, $element);
                                let contents = element.contents();
                                angular.forEach(contents, content => {
                                    if(content.nodeType !== 3) { // 3 is a text node
                                        $compile(content)($scope);
                                    }
                                });
                            });
                        }
                    }, true);
                };
            }
        };
    });

})(angular);
