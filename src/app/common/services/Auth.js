test48App.factory('Auth', function (Session, User) {
    var Auth = {};

    /**
     * Determines if user is authenticated
     */
    Auth.isAuthenticated = function () {
      return Session.access_token != null;
    };

    /**
     * Returns current access token from session
     */
    Auth.getAccessToken = function () {
      return Session.access_token;
    };

    /**
     * Set single access token on session without any other data
     * @param access_token
     */
    Auth.setAccessToken = function (access_token) {
      Session.setAccessToken(access_token);
    };

  /**
   * Perform user login
   */
  Auth.login = function (access_token, user_id, role, remember) {
    Session.set(access_token);
  };


  /**
     * Perform user logout
     */
    Auth.logout = function () {
        Session.delete();
    };

  /**
   * Returns current user data
   */
  Auth.getUser = function () {
    return User;
  };

  /**
   * Sets current user data
   */
  Auth.setUser = function (user) {
    User.setData(user);
  };

  /**
   * Returns current user ID
   */
  Auth.getUserId = function () {
    return Session.user_id;
  };


  return Auth;
});
