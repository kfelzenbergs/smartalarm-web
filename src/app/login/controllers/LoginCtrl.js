test48App.controller('LoginCtrl', function (Rest, Auth, $state) {
    var vm = this;

  vm.login_credentails = {
    'username': '',
    'password': ''
  };

  vm.loading = false;
  vm.error_message = '';

  vm.login = function (is_valid, credentials) {
    if (!is_valid) {
      return;
    }

    vm.loading = true;
    vm.error_message = '';

    Rest.loginUser(credentials['username'], credentials['password']).then(function (user) {
      // Login user
      Auth.login(user['access_token']);

      // Logged in data on session
      Auth.setUser(user);

      $state.go('user.home');

    }, function (error) {
      vm.error_message = error;
      vm.loading = false;
    });
  };
});
