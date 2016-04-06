// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('chineselearn', [
    'ionic',  // ionic framework
    'ngCookies',
    'ngMessages',
    'pascalprecht.translate',  // inject the angular-translate module
    'tmh.dynamicLocale', // inject the angular-dynamic-locale module
    'toaster', // inject the angularjs-toaster module
    'LocalForageModule', // inject the angular-localforage module
    'chineselearn.controllers', 'chineselearn.config', 'chineselearn.directives', 'chineselearn.filters', 'chineselearn.services' //customs
])

.run(["$ionicPlatform", "$filter", "$timeout", "toaster", "$rootScope", "$interval", function ($ionicPlatform, $filter, $timeout, toaster, $rootScope, $interval) {
    $ionicPlatform.ready(function () {
        cordova.plugins.Keyboard.disableScroll(true);
        if (window.StatusBar && !ionic.Platform.isAndroid()) {
            StatusBar.styleLightContent();
        };

        if (typeof analytics !== undefined) {
            analytics.startTrackerWithId("UA-46856632-5");
            analytics.setUserId(device.uuid);
        } else {
            console.log("Google Analytics Unavailable");
            $rootscope.connectionFails++;
        }
    });

    // Calculate Error Times for Network Disability
    $rootScope.connectionFails = 0;
    $interval(function () {
        if ($rootScope.connectionFails > 1) {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + $filter('translate')('INTERNET_CONNECTION_NONE')
            });

            $timeout(function () {
                $ionicLoading.hide();
                $rootScope.connectionFails = 0;
            }, 5000);
        }
    }, 10000);

    // Exit App; only for Android System
    if (ionic.Platform.isAndroid()) {
        var countTimerForCloseApp = false;
        $ionicPlatform.registerBackButtonAction(function (e) {
            e.preventDefault();
            if (countTimerForCloseApp) {
                ionic.Platform.exitApp();
            } else {
                countTimerForCloseApp = true;
                // Force to popup immediately
                $timeout(function () {
                    toaster.pop({
                        type: 'error',
                        body: $filter('translate')('CONFIRM_BEFORE_APP_EXIT'),
                        toasterId: 1
                    });
                }, 0);

                $timeout(function () {
                    countTimerForCloseApp = false;
                }, 5000);
            };
            return false;
        }, 101);
    };
}])

.config(["$httpProvider", "$ionicConfigProvider", "tmhDynamicLocaleProvider", "$translateProvider", "$localForageProvider", "$stateProvider", "$urlRouterProvider", function ($httpProvider, $ionicConfigProvider, tmhDynamicLocaleProvider, $translateProvider, $localForageProvider, $stateProvider, $urlRouterProvider) {
    $httpProvider.defaults.useXDomain = true;

    //global configure
    $ionicConfigProvider.tabs.position('bottom');

    //locale location
    tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');

    // i18n
    $translateProvider
      .useStaticFilesLoader({
          prefix: 'i18n/',
          suffix: '.json'
      })
      .registerAvailableLanguageKeys(['de', 'en', 'es', 'fr', 'hi', 'ja', 'pt', 'ru', 'zh'], {
          'de': 'de', 'de_*': 'de',
          'en': 'en', 'en_*': 'en',
          'es': 'es', 'es_*': 'es',
          'fr': 'fr', 'fr_*': 'fr',
          'hi': 'hi', 'hi_*': 'hi',
          'ja': 'ja', 'ja_*': 'ja',
          'pt': 'pt', 'pt_*': 'pt',
          'ru': 'ru', 'ru_*': 'ru',
          'zh': 'zh', 'zh_*': 'zh'
      })
      .preferredLanguage('en')
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escapeParameters')
      .useLocalStorage();

    // Setup defaults for LocalForage
    $localForageProvider.config({
        name: 'ChineseLearnInfo', // name of the database and prefix for your data, it is "lf" by default
        storeName: 'prefPosts', // name of the table
        description: 'Let user to keep their preference on ChineseLearnInfo Post(s) on mobile.'
    });

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
          cache: false,
          views: {
              'tab-posts': {
                  templateUrl: 'templates/tab-posts.html',
                  controller: 'PostsCtrl'
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
          cache: false,
          views: {
              'tab-tags': {
                  templateUrl: 'templates/tab-tags.html',
                  controller: 'TagsCtrl'
              }
          }
      })
      .state('tab.tag-posts', {
          url: '/tagposts/:tagSlug/:tagName',
          views: {
              'tab-posts': {
                  templateUrl: 'templates/tab-posts.html',
                  controller: 'PostsCtrl'
              }
          }
      })
      .state('tab.categories', {
          url: '/categories',
          cache: false,
          views: {
              'tab-categories': {
                  templateUrl: 'templates/tab-categories.html',
                  controller: 'CategoriesCtrl'
              }
          }
      })
      .state('tab.category-posts', {
          url: '/categoryposts/:categorySlug/:categoryName',
          views: {
              'tab-posts': {
                  templateUrl: 'templates/tab-posts.html',
                  controller: 'PostsCtrl'
              }
          }
      })
      .state('tab.areas', {
           url: '/areas',
           cache: false,
           views: {
               'tab-areas': {
                   templateUrl: 'templates/tab-areas.html',
                   controller: 'AreasCtrl'
               }
           }
      })
        .state('tab.areas-posts', {
            url: '/areaposts/:areaSlug/:areaName',
            views: {
                'tab-posts': {
                    templateUrl: 'templates/tab-posts.html',
                    controller: 'PostsCtrl'
                }
            }
        })
      .state('tab.settings', {
          url: '/settings',
          views: {
              'tab-settings': {
                  templateUrl: 'templates/tab-settings.html',
                  controller: 'SettingsCtrl'
              }
          }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');
}]);