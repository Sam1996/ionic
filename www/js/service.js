angular.module('starter.services', [])

.factory('AuthService',function($firebaseAuth,$firebaseArray,$rootScope,$state,$ionicLoading,$ionicPopup,$http,$window){

  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  var authUser = $firebaseAuth(ref);
  var authRef = $firebaseArray(ref);

  return{

    doSignup : function(username,email,phone,state,district,city,bloodgroup,communication,wish,password){

      
      ref.orderByChild("phone").equalTo(phone).on('value',function(snapshot){
        $rootScope.alreadySignedIn = snapshot.val();
      })
        if($rootScope.alreadySignedIn){
          $ionicPopup.alert({
            title:'Error Signing In',
            template:'User already exists! try logging in!'
          });
        }
        else{
          authRef.$add({
            username:username,
            email:email,
            phone:phone,
            state:state,
            district:district,
            city:city,
            bloodgroup:bloodgroup,
            communication:communication,
            wish:wish,
            password:password

          }).then(function(){
            $ionicPopup.alert({
              title:'Success',
              template:'User added Successfully'
            });

          }).then(function(){
            ref.on("child_added", function(snapshot) {
              var signedUsers = snapshot.val();
              //console.log(signedUsers);
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
          });
        }


    },

    doLogin : function(phone,password,remembered){
      //$rootScope.userData = [];
      ref.orderByChild("phone")
        .startAt(phone).endAt(phone)
        .on('value',function(snapshot) {
          var result = snapshot.val();
          console.log(result);
          if(result){
            ref.orderByChild("phone")
            .equalTo(phone).on('child_added',function(snapshot){
              var result = snapshot.val();
              if(password == snapshot.val().password && phone == snapshot.val().phone){
                window.localStorage.setItem('currentUser',snapshot.val().phone);
                var currentUser = window.localStorage.getItem('currentUser');
                $rootScope.currentUser = currentUser;
                $window.location.reload();
                $rootScope.isLoggedin = true;
                $state.go('app.home');
                console.log('success! logged in as : ' + currentUser);
                if(remembered == true){
                  window.localStorage.setItem('isRemembered',remembered);
                  window.localStorage.setItem('rememberedPhone',phone);
                  window.localStorage.setItem('rememberedPassword',password);
                }
                else if(remembered == false){
                  window.localStorage.setItem('isRemembered',remembered);
                  window.localStorage.removeItem('rememberedPhone');
                  window.localStorage.removeItem('rememberedPassword'); 
                }
              }
              else{
                $ionicPopup.alert({
                  title:'Login error',
                  template : 'username or password missmatch!'
                });
              }
            });
          }

          else if(password == 'appadmin123' && phone == '123456789'){
            $state.go('admin.home');
            console.log('success');
          }
          else{
            $ionicPopup.alert({
              title:'Invalid user',
              template : 'Please register to login!'
            });
            console.log('No user found');
          }
      });
    },

    logout : function(){
      var loggedout = window.localStorage.removeItem('currentUser');
      $rootScope.isRemembered = window.localStorage.getItem('isRemembered');
      $rootScope.loginData = {
        "remember" : $rootScope.isRemembered
      }
      console.log(loggedout);
    }


  };

})


.factory('RequestService',function($firebaseAuth,$firebaseArray,$rootScope,$state,$ionicLoading,$ionicPopup,$http){

  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'requests');
  var reqRef = $firebaseArray(ref);

  return{
    makeRequest : function(username,patientName,attendee,attendeeNumber,state, district, city, hospital, bloodgroup, urgency){
      reqRef.$add({
        currentUser : username,
        patientName : patientName,
        attendee : attendee,
        attendeeNumber : attendeeNumber,
        state : state,
        district : district,
        city : city,
        hospital : hospital,
        bloodgroup : bloodgroup,
        urgency : urgency
      }).then(function(){

        $ionicPopup.alert({
          title : 'Success',
          template : 'Request Added!'
        });

      }).catch(function(error){
        $ionicPopup.alert({
          title : 'Error',
          template : 'Error making request!'
        });
        console.log(error);
      });
    }
  }
})

.factory('data',function($firebaseAuth,$firebaseArray,$rootScope){
  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  return $firebaseArray(ref);
})

.factory('reqData',function($firebaseAuth,$firebaseArray,$rootScope){
  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'requests');
  return $firebaseArray(ref);
})

.factory('currentUserData',function($firebaseAuth,$firebaseArray,$rootScope){
  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  var dataRef = $firebaseArray(ref);
  var currentUser = window.localStorage.getItem('currentUser');
  return {
    userData : function(){
        ref.orderByChild("phone").equalTo(currentUser).on('child_added',function(snapshot){
          var data = snapshot.val();
          console.log(data);
        })
    }
  }

})

.factory('profileService',function($firebaseAuth,$firebaseArray,$rootScope,$ionicPopup,$window){
  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  var profileRef = $firebaseArray(ref);
  return{
    edit : function(username,email,phone,state,district,city,bloodgroup,communication,wish,password){
              ref.orderByChild('phone').equalTo($rootScope.currentUser).on('child_added',function(snapshot){
                $rootScope.key = snapshot.key();
                console.log($rootScope.key);
              });
              var onComplete = function(error) {
                if (error) {
                  $ionicPopup.alert({
                    title : 'Error',
                    template : 'Profile update failed!'
                  });
                } else {
                  $ionicPopup.alert({
                    title : 'Success',
                    template : 'Profile updated successfully!'
                  }).then(function(){
                    $window.location.reload();
                  });
                }
              };
              ref.child($rootScope.key).update({
                bloodgroup:bloodgroup,
                city:city,
                communication:communication,
                district:district,
                email:email,
                password:password,
                phone:phone,
                state:state,
                username:username,
                wish:wish,
              }, onComplete);


    }
  }

})


.factory('adminProfileService',function($firebaseAuth,$firebaseArray,$rootScope,$ionicPopup,$window,$state){
  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  var profileRef = $firebaseArray(ref);
  return{
    edit : function(username,email,phone,state,district,city,bloodgroup,communication,wish,password){
              ref.orderByChild('phone').equalTo($rootScope.currentEdit).on('child_added',function(snapshot){
                $rootScope.key = snapshot.key();
                console.log($rootScope.key);
              });
              var onComplete = function(error) {
                if (error) {
                  $ionicPopup.alert({
                    title : 'Error',
                    template : 'Profile update failed!'
                  });
                } else {
                  $ionicPopup.alert({
                    title : 'Success',
                    template : 'Profile updated successfully!'
                  })
                }
              };
              ref.child($rootScope.key).set({
                bloodgroup:bloodgroup,
                city:city,
                communication:communication,
                district:district,
                email:email,
                password:password,
                phone:phone,
                state:state,
                username:username,
                wish:wish,
              }, onComplete);


    }
  }

})


.factory('deleteService',function($firebaseAuth,$firebaseArray,$rootScope){
  var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + 'newUser');
  return $firebaseArray(ref);
  return{
    deleteData : function(donor){
      return dataRef.$remove(donor);
    }
  }
})


.factory('postService',function($firebaseAuth,$firebaseArray,$rootScope,$ionicPopup){
    var ref = new Firebase("https://cc-bloodapp.firebaseio.com/" + "posts");
    var postRef = $firebaseArray(ref);
    return{
       publishPost : function(title,subTitle,post,publishedOn){
           postRef.$add({
               postTitle : title,
               postSubTitle : subTitle,
               post: post,
               date : publishedOn
           }).then(function(){
                   $ionicPopup.alert({
                       title:'Success',
                       template:'Post published successfully!'
                   });

               }).catch(function(error){

                   $ionicPopup.alert({
                       title:'Error',
                       template:'Error publishing post, please try again!'
                   });

                   console.log(error);

               })
       }
    }
})
