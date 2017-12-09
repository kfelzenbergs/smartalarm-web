trackerOwlsApp.controller('UserHomeCtrl', function (Rest, Auth, User, NgMap, $interval, $scope, $location) {
  var vm = this;
  var numbers = new RegExp(/^[0-9]+$/);

  vm.trackerArray = []
  
  vm.selectedTrackerData = {
    asset_name: "",
    asset_reg_nr: "",
    last_known_address: ""
  }

  vm.setTracker = function(identity) {
    $(".overlay").show();
    vm.tracker = identity;
    vm.doRequestOnce();
  };

  vm.trackerInfo = function() {
    console.info("show additional trackerInfo");
  };

  vm.doRequestOnce = function() {
    Rest.getStatsGateway(vm.tracker).then(function(response){
      $(".overlay").hide();      
      vm.selectedTrackerData = {
        tracker_id: response.tracker_id,
        tracker_name: response.tracker_name,
        asset_name: response.asset_name,
        asset_reg_nr: response.asset_reg_nr,
        last_known_address: response.last_known_address,
        last_time_updated: response.last_time_updated,
        lat: response.lat,
        lon: response.lon,
        satellites: response.satellites,
        speed: response.speed,
        bat_level: response.bat_level,
        car_running: response.car_running,
        last_trip: response.last_trip
      }

      vm.trackerArray = [];
      vm.trackerArray.push(
        {
          data: {
            asset_name: response.asset_name,
            asset_reg_nr: response.asset_reg_nr
          },
          pos: {
            latitude: response.lat,
            longitude: response.lon
          },
          class: "my1"
        }
      );

      vm.map = {
        center: {
          latitude: response.lat,
          longitude: response.lon
        },
        zoom: 16,
        icon: 'http://www.myiconfinder.com/uploads/iconsets/128-128-74de69d985e32df30bb106c5f15e567e.png'
      };
    },function(error){
      console.info('errrrorrr!')
    })
  };

  vm.fetchData = function() {
    trackerDataFetcher = $interval(function() {
      if (Auth.isAuthenticated()) {
        //console.info($state.current);
        vm.doRequestOnce();
      }
      else {
        vm.stopFetch();
      }
    }, 10000);

    vm.stopFetch = function() {
      if (angular.isDefined(trackerDataFetcher)) {
        $interval.cancel(trackerDataFetcher);
        stop = undefined;
      }
    }
  };

  $scope.$on("$destroy", function() {
    vm.stopFetch();
  });

  (function init() {
    NgMap.getMap('actual-map').then(function(map) {
    }).catch(function(map){
        console.error('map error: ', map);
    });

    Rest.getTrackers().then(function(response){
      vm.trackers = response;

      // get data for one tracker
      if (numbers.test($location.hash())) {
        vm.tracker = vm.trackers[$location.hash()-1].identity
      }
      else {
        vm.tracker = response[0].identity;
      }
      $(".overlay").show();
      vm.doRequestOnce();
      vm.fetchData();
    })
  })();

});

trackerOwlsApp.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);
