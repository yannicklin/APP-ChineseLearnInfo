angular.module('chineselearn.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('PostsCtrl', function ($scope, DataLoader, $stateParams, $timeout, $log, $ionicLoading, $ionicHistory) {
    //TODO: Loading not shown
    $scope.show = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $scope.$on('$viewContentLoaded', function () {
        $ionicLoading.hide();
    });

    // Get all of our posts [under Params constraint]
    var termQueryString;
    if ($stateParams.tagSlug) {
        termQueryString = '?filter[tag]=' + $stateParams.tagSlug;
        $scope.termQS = { Type: 'TAB_TITLE_TAGS', Term: $stateParams.tagName };
    } else if ($stateParams.categorySlug) {
        termQueryString = '?filter[category_name]=' + $stateParams.categorySlug;
        $scope.termQS = { Type: 'TAB_TITLE_CATEGORIES', Term: $stateParams.categoryName };
    } else {
        //TODO: initial to get all while click original tab of "POSTS"
        termQueryString = '';
    }

    $scope.loadPosts = function () {
        DataLoader.get('posts' + termQueryString).then(function (response) {
            $scope.posts = response.data;
        }, function(response) {
            $log.error('error', response);
        });
    }

    // Load posts on page load
    $scope.loadPosts();

    // Pull to refresh
    $scope.doRefresh = function() {
  
        $timeout( function() {

            $scope.loadPosts();

        }, 1000);
      
    };
    
})

.controller('PostDetailCtrl', function ($scope, $stateParams, DataLoader, $sce, $timeout, $log, $ionicLoading) {
    $scope.show = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $scope.loadPost = function() {
        DataLoader.get('posts/' + $stateParams.postId).then(function (response) {
            $scope.post = response.data;
            $log.debug($scope.post);

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(response.data.content.rendered);

            $ionicLoading.hide();
        }, function(response) {
            $log.error('error', response);
            $ionicLoading.hide();
        });
    }

    $scope.loadPost();

    // Pull to refresh
    $scope.doRefresh = function() {
        $timeout( function() {
            $scope.loadPost();
        }, 1000);
    };
})


.controller('TagsCtrl', function ($scope, DataLoader, $timeout, $log, $ionicLoading) {
    $scope.show = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $scope.loadTags = function () {
        DataLoader.get('tags').then(function (response) {
            $scope.tags = response.data;
            $log.debug(response.data);
            $ionicLoading.hide();
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
        });
    }

    $scope.loadTags();

    // Pull to refresh
    $scope.doRefresh = function () {
        $timeout(function () {
            $scope.loadTags();
        }, 1000);
    };
})


.controller('CategoriesCtrl', function ($scope, DataLoader, $timeout, $log, $ionicLoading) {
    $scope.show = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $scope.loadCategories = function () {
        DataLoader.get('categories').then(function (response) {
            $scope.categories = response.data;
            $log.debug(response.data);
            $ionicLoading.hide();
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
        });
    }

    $scope.loadCategories();

    // Pull to refresh
    $scope.doRefresh = function () {
        $timeout(function () {
            $scope.loadCategories();
        }, 1000);
    };
})


.controller('AccountCtrl', function ($scope, $translate, tmhDynamicLocale, AppSettings, $ionicHistory, EmailSender, $filter, $log) {
    $scope.forms = {};
    $scope.ctForm = {};
    $scope.settings = {
      enableFriends: true,
      language: $translate.use()
  }

  $scope.$watch('settings.language', function () {
      AppSettings.change('language', $scope.settings.language);
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
  });

    // contact form submitting
  $scope.formSubmit = function() {
      var mailJSON = {
          "key": AppSettings.get('emailserviceKey'),
          "message": {
              "html": $scope.ctForm.ctMessage,
              "text": $scope.ctForm.ctMessage,
              "subject": "Message sent via Mobile APP - ChineseLearn.info, " + $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss Z'),
              "from_email": $scope.ctForm.ctEmail,
              "from_name": $scope.ctForm.ctName,
              "to": [
                  {
                      "email": AppSettings.get('contactForm2Email'),
                      "name": AppSettings.get('contactForm2User'),
                      "type": "to"
                  }
              ],
              "important": false,
              "track_opens": null,
              "track_clicks": null,
              "auto_text": null,
              "auto_html": null,
              "inline_css": null,
              "url_strip_qs": null,
              "preserve_recipients": null,
              "view_content_link": null,
              "tracking_domain": null,
              "signing_domain": null,
              "return_path_domain": null
          },
          "async": false,
          "ip_pool": "Main Pool"
      };
      EmailSender.send(mailJSON);
      alert("Thanks " + $scope.ctForm.ctName + ", your message has been sent.");

      //reset Form
      $scope.ctForm = {};
      $scope.forms.contactForm.$setPristine();
  };
});
