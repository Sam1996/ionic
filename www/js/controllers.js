angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$ionicHistory,$ionicModal, $timeout,$state,$rootScope,currentUserData) {

  $scope.logout = function(){
    var loggedOutUser = window.localStorage.removeItem('currentUser');
    $rootScope.isLoggedin = false;
    console.log(loggedOutUser);
    $timeout(function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
        });
        $state.go('login');
    }, 30);

  }


var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');

ref.orderByChild('phone').equalTo($rootScope.currentUser).on('child_added',function(snapshot){
  $scope.users = snapshot.val().communication;
  $rootScope.thisUser = snapshot.val().username;
  console.log($scope.users);
})

})

  .controller('requestCtrl', function($scope,$rootScope,AuthService,RequestService,$cordovaSms,$ionicPopup, $firebaseArray) {

    $scope.request = function(requestData){
      var username = $rootScope.thisUser;//window.localStorage.getItem('currentUser');
      var patientName = requestData.username;
      var attendee = requestData.attendeeName;
      var attendeeNumber = requestData.attendeeNumber;
      var state = requestData.state;
      var district = requestData.district;
      var city = requestData.city;
      var hospital = requestData.hospitalName;
      var bloodgroup = requestData.bloodgroup;
      var urgency = requestData.urgent;

      if(username != null && patientName != null && attendee != null && attendeeNumber != null && state != null && district != null && city != null && hospital != null && bloodgroup != null){
          RequestService.makeRequest(username,patientName,attendee,attendeeNumber,state, district, city, hospital, bloodgroup, urgency);

          //$scope.sendsms = function(){
          document.addEventListener("deviceready",function(){
              var message = 'Request from :' + username + 'Patient Name :' + patientName + 'Attendee :' + attendee + 'Requested for blood :' + bloodgroup + 'Attendee Number :' + attendeeNumber + 'Hospital :' + hospital;
              var options = {
                  replaceLineBreaks: true,
                  android:{
                      intent : 'INTENT'
                      //intent : ''
                  }
              };
              $cordovaSms.send('9487354083',message, options).then(function(){
                  //alert("success! sms was sent");
              },function(error){
                  console.log(error);
                  alert(error);
              });
          });
          //}
      }
        else{
          $ionicPopup.alert({
              title : 'Invalid credentials',
              template : 'Please make sure that all the fields are filled!'
          });
      }

    }

    //area reference
    var areaRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Areas');
    var areas = $firebaseArray(areaRef);
    //districts refference
    var distRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Districts');
    var districts = $firebaseArray(distRef);
    //States reference
    var stateRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'States');
    var states = $firebaseArray(stateRef);

      $scope.Areas = areas;
      $scope.Districts = districts;
      $scope.States = states;

  })

.controller('loginController', function($scope, $stateParams,AuthService,$rootScope) {

var isRemembered = window.localStorage.getItem('isRemembered');
var rememberedPhone = window.localStorage.getItem('rememberedPhone');
var rememberedPassword = window.localStorage.getItem('rememberedPassword');
console.log("Is remembered ?"+ " " + isRemembered + ", " + rememberedPhone + ", " + rememberedPassword);

$scope.remember = isRemembered;

$scope.loginData = {
  "phone" : rememberedPhone,
  "password" : rememberedPassword,
  "remember" : isRemembered
}

$scope.login = function(loginData){
  var phone = loginData.phone;
  var password = loginData.password;
  var remembered = loginData.remember;

  AuthService.doLogin(phone,password,remembered);

}


  /*$scope.rememberMe = function(loginData){
    if(loginData.remember == true){
      window.localStorage.setItem('remembered',loginData.remember);
      $rootScope.rememberValue = window.localStorage.getItem('remembered');
      $rootScope.loginData= {
        "remember" : false
      }
      console.log($rootScope.loginData.remember);
    }
  }*/

})


.controller('signupController', function($scope, $stateParams, AuthService, data,$http, $firebaseArray) {

  $scope.signupData = {};

  $scope.signup = function(signupData){

    var username = signupData.username;
    var email = signupData.email;
    var phone = signupData.phone;
    var state = signupData.state;
    var district = signupData.district;
    var city = signupData.city;
    var bloodgroup = signupData.bloodgroup;
    var communication = signupData.communication;
    var wish = signupData.wish;
    var password = signupData.password;

    AuthService.doSignup(username,email,phone,state,district,city,bloodgroup,communication,wish,password);

  }

  $scope.signupData = {};
  $scope.SignedInUsers = data;
  //area reference
  var areaRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Areas');
  var areas = $firebaseArray(areaRef);
  //districts refference
  var distRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Districts');
  var districts = $firebaseArray(distRef);
  //States reference
  var stateRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'States');
  var states = $firebaseArray(stateRef);

    $scope.Areas = areas;
    $scope.Districts = districts;
    $scope.States = states;

})

.controller('myRequestController', function($scope, $stateParams,reqData,$rootScope) {

  $scope.currentUSerRequest = window.localStorage.getItem('currentUser');
  $scope.myRequests = reqData;
  /*var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'requests');
  ref.orderByChild("patientName").equalTo($scope.currentUSerRequest).on('child_added',function(snapshot){
    $scope.myRequests = snapshot.val();
  });*/

})


.controller('adminPlaylistsCtrl', function($scope, $stateParams) {
})

.controller('donorController', function($scope, $stateParams, data) {

    $scope.donors = data;
})

.controller('recepientController', function($scope, $stateParams, data,$state,$cordovaSms,reqData) {

    $scope.recepients = data;
    $scope.whichItem = $stateParams.routeId;
    $scope.delete = function(){
        return $scope.recepients.$remove($scope.recepients[$scope.whichItem]);
    }
    $scope.requests = reqData;

})


.controller('profileController', function($scope, $stateParams,data, $firebaseArray,$rootScope,profileService,$http) {

  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  ref.orderByChild('phone').equalTo($rootScope.currentUser).on('child_added',function(snapshot){
    $scope.username = snapshot.val().username;
    $scope.email = snapshot.val().email;
    $scope.phone = snapshot.val().phone;
    $scope.state = snapshot.val().state;
    $scope.district = snapshot.val().district;
    $scope.city = snapshot.val().city;
    $scope.bloodgroup = snapshot.val().bloodgroup;
    $scope.communication = snapshot.val().communication;
    $scope.wish = snapshot.val().wish;
    $scope.password = snapshot.val().password;
  });
$scope.editProfile = function(username,email,phone,state,district,city,bloodgroup,communication,wish,password){
  var username = username;
  var email = email;
  var phone = phone;
  var state = state;
  var district = district;
  var city = city;
  var bloodgroup = bloodgroup;
  var communication = communication;
  var wish = wish;
  var password = password;
  profileService.edit(username,email,phone,state,district,city,bloodgroup,communication,wish,password);
}

//area reference
  var areaRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Areas');
  var areas = $firebaseArray(areaRef);
  //districts refference
  var distRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Districts');
  var districts = $firebaseArray(distRef);
  //States reference
  var stateRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'States');
  var states = $firebaseArray(stateRef);

    $scope.Areas = areas;
    $scope.Districts = districts;
    $scope.States = states;

})

.controller('adminDonorController', function($scope, $stateParams, data) {

    $scope.donors = data;
    $scope.listCanSwipe = true;
    $scope.whichItem = $stateParams.routeId;
    $scope.delete = function(donor){
      return $scope.donors.$remove(donor);
    }
})

.controller('adminRecepientController', function($scope, $stateParams, data,$state,$cordovaSms,reqData) {

    $scope.recepients = data;
    $scope.listCanSwipe = true;
    $scope.delete = function(recepient){
      return $scope.recepients.$remove(recepient);
    }
    $scope.whichItem = $stateParams.routeId;
    /*$scope.writeSms = function(){
      document.addEventListener("deviceready",function(){
        var phoneNumber = $scope.recepients[$scope.whichItem].phone;
        var options = {
          replaceLineBreaks: false,
          android:{
            intent : 'INTENT',
            //intent : ''
          }
        };
        $cordovaSms.send(phoneNumber,'', options).then(function(){
        },function(error){
          console.log(error);
          alert(error);
        });
      });
    }*/
    $scope.requests = reqData;
})

.controller('adminRequestController', function($scope, $stateParams, reqData) {
    $scope.requests = reqData;
    $scope.delete = function(request){
      return $scope.requests.$remove(request);
    }
    $scope.listCanSwipe = true;
})

.controller('adminEditProfileController', function($scope,$http, $stateParams,data, $firebaseArray,$rootScope,adminProfileService) {

    $scope.whichItem = $stateParams.routeId;
    $scope.recepients = data;
//  ref.orderByChild('phone').equalTo($rootScope.currentUser).on('child_added',function(snapshot){
    $scope.username = $scope.recepients[$scope.whichItem].username;
    $scope.email = $scope.recepients[$scope.whichItem].email;
    $scope.phone = $scope.recepients[$scope.whichItem].phone;
    $scope.state = $scope.recepients[$scope.whichItem].state;
    $scope.district = $scope.recepients[$scope.whichItem].district;
    $scope.city = $scope.recepients[$scope.whichItem].city;
    $scope.bloodgroup = $scope.recepients[$scope.whichItem].bloodgroup;
    $scope.communication = $scope.recepients[$scope.whichItem].communication;
    $scope.wish = $scope.recepients[$scope.whichItem].wish;
    $scope.password = $scope.recepients[$scope.whichItem].password;
//  });
    $rootScope.currentEdit = $scope.recepients[$scope.whichItem].phone;
$scope.editProfile = function(username,email,phone,state,district,city,bloodgroup,communication,wish,password){
  var username = username;
  var email = email;
  var phone = phone;
  var state = state;
  var district = district;
  var city = city;
  var bloodgroup = bloodgroup;
  var communication = communication;
  var wish = wish;
  var password = password;
  adminProfileService.edit(username,email,phone,state,district,city,bloodgroup,communication,wish,password);
}

//area reference
  var areaRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Areas');
  var areas = $firebaseArray(areaRef);
  //districts refference
  var distRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Districts');
  var districts = $firebaseArray(distRef);
  //States reference
  var stateRef = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'States');
  var states = $firebaseArray(stateRef);

    $scope.Areas = areas;
    $scope.Districts = districts;
    $scope.States = states;



})

.controller('PostController', function($scope, $rootScope, $cordovaCamera, $stateParams ,postService, $firebaseArray, $http) {
        var date = new Date();
    /*$scope.addData = function(){
      $http.get('/js/districts.json').success(function(data){
        $rootScope.Areas = data;
      }).then(function(){
        var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'Districts');
        var dataRef = $firebaseArray(ref);
        var length = $rootScope.Areas.length;
        for(var i=0; i<length ; i++){
          dataRef.$add({
            state: $rootScope.Areas[i].state,
            district: $rootScope.Areas[i].district
          });
        }
      });
    }*/
    $scope.images = [];
    $scope.getImage = function(){
      var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 200,
            targetHeight: 200
        };
      $cordovaCamera.getPicture(options).then(function(imageUri) {
            console.log('img', imageUri);
            $scope.images.push(imageUri);
                    
        }, function(err) {
            alert("Error");// error
        });
    }
    $scope.publish = function(postData){
        var title = postData.Title;
        var subTitle = postData.subTitle;
        var post = postData.Message;
       var publishedOn = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        postService.publishPost(title,subTitle,post,publishedOn);
    }
})


.controller('homeController', function($scope, $stateParams ,postService, $firebaseArray) {
        var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + "posts");
        $scope.posts = $firebaseArray(ref);
        $scope.delete = function(post){
            return $scope.posts.$remove(post);
        }
})


.controller('passwordController', function($scope, $stateParams, $firebaseArray,$rootScope,randomString,$ionicPopup) {
    var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + "newUser");
    $scope.reset = function(resetData){
      var phone = resetData.phone;
      ref.orderByChild("phone").equalTo(phone).on('child_added',function(snapshot){
        $rootScope.forgottenUser = snapshot.val();
        $rootScope.forgottenUserName = snapshot.val().username;
        $rootScope.forgottenUserEmail = snapshot.val().email;
        $rootScope.forgottenUserPhone = snapshot.val().phone;
        $rootScope.forgottenUserState = snapshot.val().state;
        $rootScope.forgottenUserDistrict = snapshot.val().district;
        $rootScope.forgottenUserCity = snapshot.val().city;
        $rootScope.forgottenUserBloodgroup = snapshot.val().bloodgroup;
        $rootScope.forgottenUserCommunication = snapshot.val().communication;
        $rootScope.forgottenUserWish = snapshot.val().wish;
      })
      if($rootScope.forgottenUser != null){
        $scope.string = randomString();
        ref.orderByChild('phone').equalTo($rootScope.forgottenUserPhone).on('child_added',function(snapshot){
          $rootScope.resetkey = snapshot.key();
        });
          var onComplete = function(error){
            if(error){
              alert("error");
            }
            else{
              alert("success");
            }
          };
          ref.child($rootScope.resetkey).set({
                bloodgroup:$rootScope.forgottenUserBloodgroup,
                city:$rootScope.forgottenUserCity,
                communication:$rootScope.forgottenUserCommunication,
                district:$rootScope.forgottenUserDistrict,
                email:$rootScope.forgottenUserEmail,
                password:$scope.string,
                phone:$rootScope.forgottenUserPhone,
                state:$rootScope.forgottenUserState,
                username:$rootScope.forgottenUserName,
                wish:$rootScope.forgottenUserWish
              },onComplete);
      }
      else{
        $ionicPopup.alert({
          title:'Invalid user',
          template : 'No user found with the given phone number'
        });
      }
    }
    
})

;
