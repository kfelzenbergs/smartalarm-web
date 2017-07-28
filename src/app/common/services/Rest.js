trackerOwlsApp.factory('Rest', function (Restangular, TokenRestangular, $q) {
    var Rest = {};

  /**
   * Get user data by its ID
   * @param user_id
   */
  Rest.getUser = function () {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('profile/').get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };

  Rest.getStatsGateway = function (tracker) {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('stats_gateway/?tracker=' + tracker).get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };

  Rest.getTrackers = function () {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('trackers/').get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };

  Rest.getStatsHistoryGateway = function (query) {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('stats_history_gateway/' + query).get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };


  Rest.loginUser = function(email, password) {
    return $q(function (resolve, reject) {
      Restangular.all('login/').post({username: email, password: password}).then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error.data);
      });
    });
  };

    return Rest;
});
