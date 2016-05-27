angular.module('open311.controllers')
.controller('NewRequestCtrl', ['$scope', '$ionicPlatform', 'API', 'NewRequest', '$state', '$cordovaCamera', '$ionicModal', '$cordovaGeolocation',
function($scope, $ionicPlatform, API, NewRequest, $state, $cordovaCamera, $ionicModal, $cordovaGeolocation) {

  // dummy lat&lng, will replace by location of user's location
  var coords = { lat: 37.339244, lng: -121.883638 };

  $scope.case = NewRequest.get();

  $scope.goto = function(name) {
    $state.go('tabs.' + name);
  };

  // PhotoView Modal
  $ionicModal.fromTemplateUrl('templates/photo-view.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openPhotoView = function() {
    $scope.modal.show();
  };
  $scope.closePhotoView = function() {
    $scope.modal.hide();
  };

  // Camera
  $scope.newPicture = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctionOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.caseImage = "data:image/jpeg;base64," + imageData;
    });
  };

  // Geolocation
  var posOptions = {timeout: 10000, enableHighAccuracy: true};

  var geocoder = new google.maps.Geocoder;

  $scope.getLocation = function() {
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        geocoder.geocode({'location': {'lat':lat, 'lng':long}}, function(results, status) {
          if (results[1]) {
            $scope.map.setZoom(15);
            var marker = new google.maps.Marker({
              position: {'lat':lat, 'lng':long},
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              draggable: true
            });
          } else {
            console.log('No results found');
          }
      });
    });
  };

  var latLng = new google.maps.LatLng(37.3315876, -121.8905004);
  var mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  $scope.submit = function () {
    console.log($scope.case);
  }
}]);