angular.module('chineselearn.directives', [])

// Set up for grouped Radio Buttons
.directive('gpRadio', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            value: '=gpRadio'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            element.addClass('button');
            element.on('click', function (e) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(scope.value);
                });
            });

            scope.$watch('model', function (newVal) {
                element.removeClass('button-positive');
                if (newVal === scope.value) {
                    element.addClass('button-positive');
                }
            });
        }
    };
});