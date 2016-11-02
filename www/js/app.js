// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','starter.adminControllers','starter.adminServices','firebase','ngCordova','angularRandomString'])

.run(function($ionicPlatform,$rootScope,$location,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.currentUser = window.localStorage.getItem('currentUser');
  console.log('Logged in as : ' + $rootScope.currentUser);

$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if(toState.authenticate === 'secure' && $rootScope.currentUser == null){
      e.preventDefault();
      $state.go('login');
    }
    //console.log(toState);
  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    authenticate:'secure'
  })

  .state('login', {
    url: '/login',
  templateUrl: 'templates/login.html',
  controller:'loginController',
  authenticate:'public'

  })

  .state('signup', {
    url: '/signup',
  templateUrl: 'templates/signup.html',
  controller:'signupController',
  authenticate:'public'

  })
  .state('forgotPassword', {
    url: '/forgotPassword',
  templateUrl: 'templates/forgotPassword.html',
  controller:'passwordController',
  authenticate:'public'

  })

  .state('app.home', {
      url: '/home',
      views: {
          'menuContent': {
              templateUrl: 'templates/landingPage.html',
              controller: 'homeController'
          }
      },
      authenticate:'secure'
   })

  .state('app.donorList', {
    url: '/donorList',
    views: {
      'menuContent': {
        templateUrl: 'templates/donorList.html',
        controller: 'donorController'
      }
    },
    authenticate:'secure'

  })

  .state('app.recepientList', {
    url: '/recepientList',
    views: {
      'menuContent': {
        templateUrl: 'templates/recepientList.html',
        controller: 'recepientController'
      }
    },
    authenticate:'secure'

  })

  .state('app.recepientListSingle', {
    url: '/recepientList/:routeId',
    views: {
      'menuContent': {
        templateUrl: 'templates/recepientListSingle.html',
        controller: 'recepientController'
      }
    },
    authenticate:'secure'

  })


  .state('app.resetProfile', {
    url: '/resetProfile',
    views: {
      'menuContent': {
        templateUrl: 'templates/resetProfile.html',
        controller: 'resetProfileController'
      }
    },
    authenticate:'secure'

  })

  .state('app.myrequest', {
      url: '/myrequest',
      views: {
        'menuContent': {
          templateUrl: 'templates/myrequest.html',
          controller : 'myRequestController'
        }
      },
      authenticate:'secure'

    })
    .state('app.requests', {
      url: '/requests',
      views: {
        'menuContent': {
          templateUrl: 'templates/requests.html',
          controller: 'requestCtrl'
        }
      },
      authenticate:'secure'

      /*,
      resolve:{
        auth : ["$q","AuthService",function($q,AuthService){
          var userInfo = AuthService.getUserInfo();
          if(userInfo){
            return $q.when(userInfo);
          }
          else{
            return $q.reject({authenticated:false});
          }
        }]
      }*/
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    },
    authenticate:'secure'

  })


//ADMIN views

.state('admin', {
url: '/admin',
abstract: true,
templateUrl: 'templates/admin/menu.html',
controller: 'AppCtrl'
})

.state('admin.search', {
url: '/search',
views: {
  'menuContent': {
    templateUrl: 'templates/admin/search.html'
  }
}
})
.state('admin.home', {
    url: '/home',
    views: {
        'menuContent': {
            templateUrl: 'templates/admin/landingPage.html',
            controller: 'homeController'
        }
    }
})

.state('admin.donorList', {
  url: '/donorList',
  views: {
    'menuContent': {
      templateUrl: 'templates/admin/donorList.html',
      controller : 'adminDonorController'
    }
  }
})

      .state('admin.donorListSingle', {
          url: '/donorList/:routeId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/admin/donorListSingle.html',
                  controller: 'adminDonorController'
              }
          }
      })

.state('admin.recepientList', {
  url: '/recepientList',
  views: {
    'menuContent': {
      templateUrl: 'templates/admin/recepientList.html',
      controller : 'adminRecepientController'
    }
  }
})

.state('admin.recepientListSingle', {
  url: '/recepientList/:routeId',
  views: {
    'menuContent': {
      templateUrl: 'templates/admin/recepientListSingle.html',
      controller: 'adminRecepientController'
    }
  }
})

.state('admin.editUserProfile', {
  url: '/editUserProfile/:routeId',
  views: {
    'menuContent': {
      templateUrl: 'templates/admin/editUserProfile.html',
      controller : 'adminEditProfileController'
    }
  }
})

.state('admin.requests', {
  url: '/requests',
  views: {
    'menuContent': {
      templateUrl: 'templates/admin/requests.html',
      controller: 'adminRequestController'
    }
  }
})

.state('admin.urgentRequests', {
  url: '/urgentRequests',
  views: {
    'menuContent': {
      templateUrl: 'templates/admin/urgentRequests.html',
      controller: 'adminRequestController'
    }
  }
})


.state('admin.single', {
url: '/playlists/:playlistId',
views: {
  'menuContent': {
    templateUrl: 'templates/admin/playlist.html',
    controller: 'PlaylistCtrl'
  }
}
})

.state('admin.createPost', {
url: '/createPost',
views: {
  'menuContent': {
    templateUrl: 'templates/admin/createPost.html',
    controller: 'PostController'
  }
}
})


  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
