trackerOwlsApp.controller('zonesCtrl', function (Rest, Auth, User, NgMap, $location, $scope) {
  var vm = this;
  vm.cpos = {}
  vm.zones = []
  vm.zoneToolsDisabled = "disabled";
  vm.selectedZone = null;
  vm.new_zone_type = null;
  vm.shapes = {
    circle: {
      obj: null,
      bounds: {}
    }
  }

  vm.zoneTypeFriendly = function(type) {
    types = [
      "Circle",
      "Rectangular",
      "Polygon"
    ]
    return types[type-1]
  };

  vm.newZoneShow = function() {
    $("#new-zone").show();
  };

  vm.newZoneHide = function() {
    $("#new-zone").hide();
  };

  vm.newZone = function(type) {
    $(".zone-entry").removeClass('active');
    vm.newZoneShow();
    vm.zoneToolsDisabled = "disabled";
 
    vm.new_zone_type = type;

    switch(type) {
      case 1: {
          // circle
          if(typeof vm.shapes.circle.obj !== "undefined" && vm.shapes.circle.obj !== null) {
            vm.shapes.circle.obj.setMap(null);
          }

          vm.shapes.circle.bounds.center = vm.cpos;
          vm.shapes.circle.bounds.radius = 1000;
  
          vm.shapes.circle.obj = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: true,
            center: vm.shapes.circle.bounds.center,
            radius: vm.shapes.circle.bounds.radius
          });

          vm.shapes.circle.obj.setMap(vm.map)
          vm.map.setCenter(vm.shapes.circle.bounds.center);

          google.maps.event.addListener(vm.shapes.circle.obj, 'center_changed', function() {
            vm.shapes.circle.bounds.center = vm.shapes.circle.obj.getCenter().toJSON();
          });
  
          google.maps.event.addListener(vm.shapes.circle.obj, 'radius_changed', function() {
            vm.shapes.circle.bounds.radius = vm.shapes.circle.obj.getRadius();
          });
        break;
      }
      case 2: {
        
        break;
      }
      case 3: {
        
        break;
      }
    }
  }

  vm.saveZone = function() {
    $(".overlay").show();
    zone = {
      name: document.getElementById("new-zone-name").value,
      tracker: document.getElementById("new-zone-tracker").value,
      alarm_on: document.getElementById("new-zone-alarm-on").value,
      alarm_enabled: document.getElementById("new-zone-alarm-enabled").value == true,
      zone_type: vm.new_zone_type
    }
    
    switch(zone.zone_type) {
      case 1: {
          zone.bounds = vm.shapes.circle.bounds
        break;
      }
      case 2: {
        
        break;
      }
      case 3: {
        
        break;
      }
    }
  
    Rest.saveZone(JSON.stringify(zone)).then(function(response){
      fetchZones();
    });

   $("#new-zone").hide();
 }

  vm.deleteZone = function() {
    Rest.deleteZone(vm.selectedZone.id).then(function(response){
      fetchZones();
    }, function(data) {
      console.info("delete error with id: " + data);
    });
    
  }

  vm.updateZone = function() {
    switch(vm.selectedZone.zone_type) {
      case 1: {
          // circle
          vm.selectedZone.bounds = vm.shapes.circle.bounds
        break;
      }
      case 2: {
        
        break;
      }
      case 3: {
        
        break;
      }
    }

    Rest.patchZone(JSON.stringify(vm.selectedZone)).then(function(response){
      fetchZones();
    });
  }

  vm.selectZone = function(zone_id) {
    vm.newZoneHide();
    vm.zoneToolsDisabled = "";
    vm.selectedZone = vm.zones[zone_id]

    switch(vm.selectedZone.zone_type) {
      case 1: {
        vm.shapes.circle.bounds = vm.selectedZone.bounds;

        if(typeof vm.shapes.circle.obj !== "undefined" && vm.shapes.circle.obj !== null) {
          vm.shapes.circle.obj.setMap(null)
        }

        vm.shapes.circle.obj = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          editable: true,
          center: vm.shapes.circle.bounds.center,
          radius: vm.shapes.circle.bounds.radius
        });

        vm.shapes.circle.obj.setMap(vm.map)
        vm.map.setCenter(vm.shapes.circle.bounds.center);

        google.maps.event.addListener(vm.shapes.circle.obj, 'center_changed', function() {
          vm.shapes.circle.bounds.center = vm.shapes.circle.obj.getCenter().toJSON();
        });

        google.maps.event.addListener(vm.shapes.circle.obj, 'radius_changed', function() {
          vm.shapes.circle.bounds.radius = vm.shapes.circle.obj.getRadius();
        });

        break;
      }
      case 2: {
        console.info("type 2");
        break;
      }
      case 3: {
        console.info("type 3");
        break;
      }
    }
  }

  function getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        vm.cpos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        vm.setMapAtCurrentPosition();

      }, function() {
        handleLocationError(true, vm.infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, vm.infoWindow, map.getCenter());
    }
  }

  vm.setMapAtCurrentPosition = function() {
    getCurrentPosition();

    vm.infoWindow.setPosition(vm.cpos);
    vm.infoWindow.setContent('You are here!');
    vm.infoWindow.open(vm.map);
    vm.map.setCenter(vm.cpos);
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(vm.map);
  }

  function initMap() {
    console.info("initiating");
    NgMap.getMap().then(function(map) {
    });
    var rectangle = new google.maps.Rectangle({
      draggable: true,
      editable: true,
      bounds: {
        north: 44.490, 
        south: -78.649,
        east: 44.599,
        west: -78.443
      }
    });
  
    vm.map = new google.maps.Map(document.getElementById('zones-map'), {
      zoom: 12,
      center: {lat: 0, lng: 0},
      mapTypeId: 'terrain',
    });
    vm.infoWindow = new google.maps.InfoWindow;
  }

  
  // //console.info("should set map now");
  // rectangle.setMap(map);

  // google.maps.event.addListener(rectangle, 'bounds_changed', function() {
  //   console.info('Bounds changed.');
  //   console.info(rectangle.bounds);
  // });

  function fetchZones() {
    Rest.getZones().then(function(response){
      $(".overlay").hide();
      vm.zones = response;
      for (i=0; i < vm.zones.length; i++) {        
        vm.zones[i].bounds = JSON.parse(vm.zones[i].bounds);
      }
      $(".zone-entry").removeClass('active');
      $("#zone-entry-1").addClass('active');
      vm.zoneToolsDisabled = "";
    });
  }

  function markSelected() {
    $(".zone-entry").removeClass('active');
    $("#zone-entry-" + $location.hash()).addClass('active');
  }

 (function init() {
    
  window.addEventListener("hashchange", markSelected);

    // if (angular.isNumber(Number($location.hash()))) {
    //   console.info("is number: [" + $location.hash() + "]");
    //   $("#zone_entry_" + Number($location.hash())).addClass('active');
    //   $("#zone_entry_" + $location.hash()).click();
    // }
    // else {
    //   console.info("is not number: [" + $location.hash() + "]");
    // } 
    
    Rest.getTrackers().then(function(response){
      vm.trackers = response;
    });
    $(".overlay").show();
    fetchZones();
    initMap();
    getCurrentPosition();
  })();
});
