trackerOwlsApp.controller('LogoutCtrl', function (Auth, $state) {
  var vm = this;

  vm.loading = true;
  vm.error_message = '';

  // Logout user
  Auth.logout();

  $state.go('login');

});
