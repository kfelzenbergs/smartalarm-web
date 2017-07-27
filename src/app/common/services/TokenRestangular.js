/**
 * Create Restangular service pre populated with access token for making authorized requests
 */
test48App.factory('TokenRestangular', function (Restangular, Auth) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setDefaultHeaders({Authorization: 'Bearer ' + Auth.getAccessToken()});
    });
});