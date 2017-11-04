/**
 * Create Restangular service pre populated with access token for making authorized requests
 */
trackerOwlsApp.factory('TokenRestangular', function (Restangular, Auth) {
    var getAccessToken = function () {
        return 'Bearer ' + Auth.getAccessToken();
    };

    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setDefaultHeaders({Authorization: getAccessToken});
    });
});
