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

  Rest.getTrips = function () {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('trips/').get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };

  Rest.getTripStats = function (trip) {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('tripstats/?trip=' + trip).get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };

  Rest.getZones = function () {
    return $q(function (resolve, reject) {
      return TokenRestangular.one('zones/').get().then(function (user) {
        resolve(user.plain());
      }, function (error) {
        reject(error);
      });
    });
  };

  Rest.patchZone = function (zone) {
    return $q(function (resolve, reject) {
      TokenRestangular.one('zones/').patch(zone).then(function (zone_data) {
        resolve(zone_data.plain());
      }, function (error) {
        reject(error.data);
      });
    });
  };

  Rest.saveZone = function (zone) {
    console.info("saveZone:");
    console.info(zone);
    return $q(function (resolve, reject) {
      TokenRestangular.all('zones/').post(zone).then(function (zone_data) {
        console.log("zone saved!");
        console.log(zone_data.plain());
        resolve(zone_data.plain());
      }, function (error) {
        reject(error.data);
      });
    });
  };

  Rest.deleteZone = function (zone_id) {
    return $q(function (resolve, reject) {
      TokenRestangular.all('zones/?id=' + zone_id).remove().then(function (response) {
        resolve(true);
      }, function (error) {
        reject(error.data);
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
