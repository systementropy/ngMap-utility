var app = angular.module("myApp", ['ngRoute','ui.bootstrap','slickCarousel','ngMap','ngFileUpload']).config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
   $locationProvider.html5Mode({
      enabled: true,
      requireBase: true
   });
   $routeProvider
   .when('/', {
   templateUrl: '/views/main.html', controller: 'MainCtrl'
   })
   .when('/#', {
   templateUrl: '/views/main.html', controller: 'MainCtrl'
   })
   .when('/directory', {
   templateUrl: '/views/directory.html', controller: 'directoryCtrl'
   })
   .when('/add', {
   templateUrl: '/views/add.html', controller: 'addCtrl'
   })
   .when('/complaint', {
   templateUrl: '/views/complaint.html', controller: 'complaintCtrl'
   })
   .otherwise({
   redirectTo: '/'
   });

}]);
app.controller('MainCtrl', function($scope) {
   
});

app.controller('directoryCtrl', function($scope,NgMap) {
   
   $scope.options={
      enableHighAccuracy: true
   };

   navigator.geolocation.getCurrentPosition(function(pos) {
       $scope.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
       NgMap.getMap().then(function(map) {
         map.setCenter($scope.position);
       });
       // console.log(JSON.stringify($scope.position));                  
   }, 
   function(error) {                    
       alert('Unable to get location: ' + error.message);
   }, $scope.options);

});

app.controller('addCtrl', function($scope,NgMap) {

   $scope.addMarker = function(){
      NgMap.getMap().then(function(map) {
         console.log(map.markers);
         if(map.markers){
            var old_marker = map.markers[0];
            old_marker.setPosition(map.getCenter());

            old_marker.setMap(map);   
         }else{
            var marker = new google.maps.Marker();
            marker.setPosition(map.getCenter());
            marker.setMap(map);   
         }
      });
   }


   $scope.submit = function(){

      var lat,lang;
      NgMap.getMap().then(function(map) {
         var marker = map.markers[0];
         console.log(marker.getPosition().lat(),marker.getPosition().lng(),$scope.labelName);
      });
      
   }
});

app.controller('complaintCtrl', function($scope,NgMap,Upload) {
   $scope.testMarkers =[
      {lat:28.61401444785838, lng:77.19867860203863, label:"qwdeqwe"},
      {lat:28.61216840976778, lng:77.21339856511236, label:"t1"},
      {lat:28.617329700109472, lng:77.22601567631841, label:"t2"},
      {lat:28.619100303322483, lng:77.21451436406255, label:"t3"}
   ];
   $scope.fileComplaint = function($event){
      $scope.showForComplaint = true;
      console.log(this.getPosition().lat(),this.getPosition().lng());
   }

   $scope.upload = function(file, cb){
      file.upload = Upload.upload({
         url: 'https://localhost/images/',
         data: {username: $scope.username, file: file},
      });
      file.upload.then(function (response) {
         $timeout(function () {
           file.result = response.data;
         });
       }, function (response) {
         if (response.status > 0)
           $scope.errorMsg = response.status + ': ' + response.data;
       }, function (evt) {
         // Math.min is to fix IE which reports 200% sometimes
         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
         console.log(file.progress);
       });
   }

   $scope.submitComplaint = function(){
      var file = $scope.picFile;
      $scope.upload(file, function(){

      });
   }
});












