trackerOwlsApp.directive('confirmDialog', function() {
    return {
        restrict: 'A',
        templateUrl: 'app/home/directives/templates/confirmDialog.html',
        link: function(scope, element, attrs){
            element.bind('click', function(e){
                var message = attrs.confirmDialog;
                // confirm() requires jQuery
                if(message && !confirm(message)){
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            });
        }
    }
});