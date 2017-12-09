trackerOwlsApp.controller("navBarCtrl", function ($scope, $location, User) {
  $scope.menuClass = function(page) {
    var current = $location.path().substring(1);
    return page === current ? "active" : "";
  };

  $scope.user = User.getName();
});
