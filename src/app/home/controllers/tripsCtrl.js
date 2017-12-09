trackerOwlsApp.controller('tripsCtrl', function (Rest, Auth, User, NgMap, $location) {
  var vm = this;
  var numbers = new RegExp(/^[0-9]+$/);
  vm.trips = []

  function markSelected() {
    $(".trip-entry").removeClass('active');
    $("#trip-entry-" + $location.hash()).addClass('active');
  }

  vm.selectTrip = function(id) {
    $(".overlay").show();

    vm.selectedTrip = vm.trips[id]
    Rest.getTripStats(vm.selectedTrip.id).then(function(response){
      $(".overlay").hide();

      vm.selectedTripStats = response;
      console.info(vm.selectedTripStats);

      if(typeof vm.routePath !== "undefined" && vm.routePath !== null) {
        vm.routePath.setMap(null);
      }

      if(typeof vm.startMarker !== "undefined" && vm.startMarker !== null) {
        vm.startMarker.setMap(null);
      }
      if(typeof vm.endMarker !== "undefined" && vm.endMarker !== null) {
        vm.endMarker.setMap(null);
      }

      var routeCoordinates = [
        
      ];
        
      angular.forEach(response, function(item){
        if (item.constructor === Array) {
          angular.forEach(response, function(sub_item){
            if (typeof item.stats.lat !== "undefined" && typeof item.stats.lon !== "undefined" && item.stats.satellites >= 3) {
              routeCoordinates.push({
                lat: sub_item.stats.lat, lon: sub_item.stats.lon
              });
            }
          });          
        }
        else {
          if (typeof item.stats.lat !== "undefined" && typeof item.stats.lon !== "undefined" && item.stats.satellites >= 3) {
            routeCoordinates.push({
              lat: item.stats.lat, lng: item.stats.lon
            });
          }
        }
      });

      console.log(routeCoordinates);

      vm.routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      // center map on trip start point
      trip_start = new google.maps.LatLng(routeCoordinates[0].lat, routeCoordinates[0].lng)
      trip_end = new google.maps.LatLng(routeCoordinates[routeCoordinates.length-1].lat, routeCoordinates[routeCoordinates.length-1].lng)

      vm.routePath.setMap(vm.map);
      vm.map.setCenter(trip_start);

      vm.startMarker = new google.maps.Marker({
        position: trip_start,
        map: vm.map,
        scale: 10,
        title: "Start",
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|69fe75'
      });
      vm.endMarker = new google.maps.Marker({
        position: trip_end, 
        map: vm.map,
        scale: 10,
        title: "Finish",
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569'
      });
    });

    
  }
  
  function initMap() {
    console.info("initiating");
    NgMap.getMap().then(function(map) {
    });
  
    vm.map = new google.maps.Map(document.getElementById('trips-map'), {
      zoom: 12,
      center: {lat: 0, lng: 0},
      mapTypeId: 'terrain',
    });
    vm.infoWindow = new google.maps.InfoWindow;
  }

  (function init() {
    window.addEventListener("hashchange", markSelected);

    $(".overlay").show();
    Rest.getTrips().then(function(response){
      vm.trips = response;
      $(".overlay").hide();
    });
    initMap();
  })();
});
