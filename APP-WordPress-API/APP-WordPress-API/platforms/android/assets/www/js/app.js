// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('chineselearn', [
    'ionic',  // ionic framework
    'ngCookies',
    'ngMessages',
    'pascalprecht.translate',  // inject the angular-translate module
    'tmh.dynamicLocale', // inject the angular-dynamic-locale module
    'chineselearn.controllers', 'chineselearn.directives', 'chineselearn.filters', 'chineselearn.services' //customs
    ])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    };
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
    };
    
  });

  // Double Click on Back Button for Exit App
  var countTimerForCloseApp = false;
  $ionicPlatform.registerBackButtonAction(function (e, $ionicHistory) {
      e.preventDefault();
      function showConfirm() {
          if (countTimerForCloseApp) {
              ionic.Platform.exitApp();
          } else {
              countTimerForCloseApp = true;
              showToastMsg($cordovaToast, $filter('translate')('CONFIRM_BEFORE_APP_EXIT'));
              $timeout(function () {
                  countTimerForCloseApp = false;
              }, 2000);
          }
      };

      // Is there a page to go back to?
      if ($ionicHistory.backView()) {
          // Go back in history
          $ionicHistory.backView().go();
      } else {
          // This is the last page: Show confirmation popup
          showConfirm();
      }
      return false;
  }, 101);
})

.config(function($ionicConfigProvider, tmhDynamicLocaleProvider, $translateProvider, $stateProvider, $urlRouterProvider) {
    //global configure
    $ionicConfigProvider.tabs.position('bottom');

    //locale
    tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');

    // i18n
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['ar', 'bn', 'de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ms', 'pt', 'ru', 'ur', 'zh'], {
          'ar': 'ar', 'ar_*': 'ar',
          'bn': 'bn', 'bn_*': 'bn',
          'de': 'de', 'de_*': 'de',
          'en': 'en', 'en_*': 'en',
          'es': 'es', 'es_*': 'es',
          'fr': 'fr', 'fr_*': 'fr',
          'hi': 'hi', 'hi_*': 'hi',
          'id': 'id', 'id_*': 'id',
          'ja': 'ja', 'ja_*': 'ja',
          'ms': 'ms', 'ms_*': 'ms',
          'pt': 'pt', 'pt_*': 'pt',
          'ru': 'ru', 'ru_*': 'ru',
          'ur': 'ur', 'ur_*': 'ur',
          'zh': 'zh', 'zh_*': 'zh'
      })
      .preferredLanguage('de')
      .fallbackLanguage(['en','zh', 'es', 'fr'])
//      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escapeParameters')
      .useLocalStorage();

  // Ionic uses AngularUI Router which uses the concept of states
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
    })
    .state('tab.dash', {
    url: '/dash',
    views: {
        'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
        }
    }
    })
    .state('tab.posts', {
        url: '/posts',
        views: {
            'tab-posts': {
                templateUrl: 'templates/tab-posts.html',
                controller: 'PostsCtrl'
            }
        }
    })
    .state('tab.posts-cht', {
        url: '/posts-cht',
        views: {
            'tab-posts-cht': {
                templateUrl: 'templates/tab-posts-cht.html',
                controller: 'Posts-CHTCtrl'
            }
        }
    })
    .state('tab.post-detail', {
        url: '/posts/:postId',
        views: {
            'tab-posts': {
                templateUrl: 'templates/post-detail.html',
                controller: 'PostDetailCtrl'
            }
        }
    })
    .state('tab.tags', {
        url: '/tags',
        views: {
            'tab-tags': {
                templateUrl: 'templates/tab-tags.html',
                controller: 'TagsCtrl'
            }
        }
    })
    .state('tab.categories', {
        url: '/categories',
        views: {
            'tab-categories': {
                templateUrl: 'templates/tab-categories.html',
                controller: 'CategoriesCtrl'
            }
        }
    })
    .state('tab.account', {
    url: '/account',
    views: {
        'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
        }
    }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});