var trackerOwlsApp = angular.module('trackerOwlsApp', [
    'ngCookies',
    'restangular',
    'pascalprecht.translate',
    'ui.router',
    'templates',
  'ngMap'
]);

trackerOwlsApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, RestangularProvider, AuthProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('login', {
        url: "/",
        templateUrl: "app/login/templates/login.html",
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      }).state('logout', {
        url: "/logout/",
        templateUrl: "app/home/templates/logout.html",
        controller: 'LogoutCtrl',
        controllerAs: 'vm'
      }).state('about', {
      url: "/about/",
      templateUrl: "app/about/templates/about.html",
      controller: 'AboutCtrl',
      controllerAs: 'vm'
    })
      .state('user', {
        abstract: true,
        templateUrl: "app/common/templates/container.html",
        params: {
          loginRequired: true
        },
        resolve: {
          init: function(Fetcher) {
            return Fetcher.fetchUser();
          }
        }
      }).state('user.home', {
        url: "/client/live/",
        templateUrl: "app/home/templates/userHome.html",
        controller: 'UserHomeCtrl',
        controllerAs: 'vm'
      }).state('user.statistics', {
        url: "/client/statistics/",
        templateUrl: "app/home/templates/statistics.html",
        controller: 'statisticsCtrl',
        controllerAs: 'vm'
      }).state('user.trips', {
        url: "/client/trips/",
        templateUrl: "app/home/templates/trips.html",
        controller: 'tripsCtrl',
        controllerAs: 'vm'
      }).state('user.zones', {
        url: "/client/zones/",
        templateUrl: "app/home/templates/zones.html",
        controller: 'zonesCtrl',
        controllerAs: 'vm'
      }).state('user.diagnostics', {
        url: "/client/diagnostics/",
        templateUrl: "app/home/templates/diagnostics.html",
        controller: 'diagnosticsCtrl',
        controllerAs: 'vm'
      }).state('user.manage', {
        url: "/client/manage/",
        templateUrl: "app/home/templates/manage.html",
        controller: 'manageCtrl',
        controllerAs: 'vm'
    });

    // Force browser to use HTML5 URL
    $locationProvider.html5Mode(true);

    // Configure API settings
    RestangularProvider.setBaseUrl(CONFIG['endpoint']);

    // Handle global errors
    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
        var status = parseInt(response.status);

        // Display global error message if server is not responding or responding badly
        if (status <= 0 || status >= 500) {
            console.log('API ERROR: status code: ', status);
        }

      if (status == 401) {
        AuthProvider.$get().logout();
      }

        return true; // error not handled
    });

    // Define English locales
    $translateProvider.translations('en', ENGLISH_LOCALES);

    // Set default locale
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
}).run(function ($rootScope, $state, Auth) {


  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    // Check if user is authenticated while trying to access limited resource
    if (toParams.loginRequired && !Auth.isAuthenticated()) {
      // Stop route execution
      event.preventDefault();

      // Redirect to login page
      $state.go('login');
    }


    // Redirect user to home view if it's logged in and trying to access login and sign up views
    if (Auth.isAuthenticated()) {
      var url_name = toState.name;
      var urls = ['login', 'landing_project_create', 'landing_project_create_trial'];

      if (urls.indexOf(url_name) > -1) {
        // Stop route execution
        event.preventDefault();

        $state.go('user.home');

      }

    }
  });



  // Global config with build information
    $rootScope.env_config = {
        'env': CONFIG['env'],
        'endpoint': CONFIG['endpoint'],
        'build_date': CONFIG['build_date']
    };
});
