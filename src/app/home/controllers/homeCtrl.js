trackerOwlsApp.controller('UserHomeCtrl', function (Rest, Auth, User, NgMap, $interval, $scope) {
  var vm = this;

  NgMap.getMap().then(function(map) {
    // console.log(map.getCenter());
    // console.log('markers', map.markers);
    // console.log('shapes', map.shapes);
  });

  vm.trackerArray = []
  
  vm.selectedTrackerData = {
    asset_name: "",
    asset_reg_nr: "",
    last_known_address: ""
  }

  vm.setTracker = function(identity) {
    vm.tracker = identity;
    vm.doRequestOnce();
  };

  vm.trackerInfo = function() {
    console.info("show additional trackerInfo");
  };

  vm.doRequestOnce = function() {
    Rest.getStatsGateway(vm.tracker).then(function(response){      
      vm.selectedTrackerData = {
        tracker_id: response.tracker_id,
        tracker_name: response.tracker_name,
        asset_name: response.asset_name,
        asset_reg_nr: response.asset_reg_nr,
        last_known_address: response.last_known_address,
        lat: response.lat,
        lon: response.lon,
        satellites: response.satellites,
        speed: response.speed,
        bat_level: response.bat_level,
        is_charging: response.is_charging
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
    Rest.getTrackers().then(function(response){
      vm.trackers = response;
      vm.tracker = response[0].identity;
      vm.doRequestOnce();
      vm.fetchData();
    })
  })();

});
