test48App.factory('Fetcher', function (Auth, Rest) {
  var Fetcher = {};

  /**
   * This method is used to fetch logged in user on page reload before any other content is loaded
   */
  Fetcher.fetchUser = function () {
    if (Auth.isAuthenticated() && !Auth.getUser().hasData()) {
      return Rest.getUser().then(function (user) {
        Auth.setUser(user);
      }, function (error) {
        console.log('API ERROR: fail user fetch: ', error);
      });
    }
  };

  return Fetcher;
});