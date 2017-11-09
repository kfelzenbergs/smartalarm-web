trackerOwlsApp.controller('statisticsCtrl', function (Rest, Auth, User, NgMap) {
  var vm = this;

  function initMap() {

    var start = moment().subtract(1, 'days');
    var end = moment();

    function cb(start, end) {
      $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange').daterangepicker({
      startDate: start,
      endDate: end,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    }, cb);

    cb(start, end);

    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
      var date_from = picker.startDate.format('YYYY-MM-DD');
      var date_to = picker.endDate.format('YYYY-MM-DD');

      fetch(date_from, date_to);
    });

    function prepareMap(response) {
      var routeCoordinates = [

      ];

      angular.forEach(response, function(item){
        routeCoordinates.push({
          lat: item.lat, lng: item.lon
        });
      })

      var routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      var map = new google.maps.Map(document.getElementById('historical_map'), {
        zoom: 12,
        center: {lat: routeCoordinates[0].lat, lng: routeCoordinates[0].lng},
        mapTypeId: 'terrain'
      });

      console.info("should set map now");
      routePath.setMap(map);
    }

    function fetch(date_from, date_to) {
      Rest.getStatsGateway(vm.tracker).then(function(response){

        vm.stats = {
          lat: response.lat,
          lon: response.lon,
          alt: response.alt,
          speed: response.speed,
          satellites: response.satellites,
          bat_level: response.bat_level,
          is_charging: response.is_charging,
          last_known_address: response.last_known_address,
          asset_name: response.asset_name,
          asset_reg_nr: response.asset_reg_nr,
          tracker_id: response.tracker_id,
          tracker_name: response.tracker_name
        }
      });

      var query = '?tracker=' + vm.tracker;
      if (date_from != 0 && date_to != 0) {
        if (angular.isDefined(date_from) && angular.isDefined(date_to)) {
          query += '&from=' + date_from + '&to=' + date_to;
        }
      }

      Rest.getStatsHistoryGateway(query).then(function(response){
        if (response.length > 0) {
          prepareMap(response);
        }
      });
    }

    fetch();
  }

  (function init() {
    Rest.getTrackers().then(function(response){
      vm.trackers = response;
      vm.tracker = response[0].identity;

      initMap();
    })
  })();
});
