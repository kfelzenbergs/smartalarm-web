test48App.controller('UserHomeCtrl', function (Rest, Auth, User, NgMap) {
  var vm = this;

  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });

  vm.stats = {lat: 0, lon: 0, satellites: 0, bat_level: 0, is_charging: 0}


  setInterval(function () {
    fetch();
  }, 10000);


  function fetch(){
    Rest.getStatsGateway(vm.tracker).then(function(response){
      vm.stats.lat = response.lat;
      vm.stats.lon = response.lon;
      vm.stats.satellites = response.satellites;
      vm.stats.speed = response.speed;
      vm.stats.bat_level = response.bat_level;
      vm.stats.is_charging = response.is_charging;

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

  }

  (function init() {
    Rest.getTrackers().then(function(response){
      vm.tracker = response[0].identity;
      fetch();
    })
  })();

  console.info(Auth.getUser().getName())
});