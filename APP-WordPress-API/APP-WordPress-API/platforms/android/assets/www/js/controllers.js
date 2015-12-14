angular.module('chineselearn.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('PostsCtrl', function ($scope, DataLoader, $timeout, $log, $ionicLoading) {

    $scope.show = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $scope.moreItems = false;

    $scope.loadPosts = function() {

        // Get all of our posts
        DataLoader.get('posts').then(function(response) {

            $scope.posts = response.data;

            $scope.moreItems = true;
            $ionicLoading.hide();
        }, function(response) {
            $log.error('error', response);
            $ionicLoading.hide();
        });

    }

    // Load posts on page load
    $scope.loadPosts();

    paged = 2;

    // Load more (infinite scroll)
    $scope.loadMore = function() {

        if( !$scope.moreItems ) {
            return;
        }

        var pg = paged++;

        $log.log('loadMore ' + pg );

        $timeout(function() {

            DataLoader.get( '?page=' + pg ).then(function(response) {

                angular.forEach( response.data, function( value, key ) {
                    $scope.posts.push(value);
                });

                if( response.data.length <= 0 ) {
                    $scope.moreItems = false;
                }
            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });


        }, 1000);

    }

    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

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
        DataLoader.get('terms/tag').then(function (response) {
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
        DataLoader.get('terms/category').then(function (response) {
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


.controller('AccountCtrl', function ($scope, $translate, tmhDynamicLocale, AppSettings, EmailSender, $filter, $log) {
    $scope.idform = {};
    $scope.settings = {
      enableFriends: true,
      //language: 'en'
  }


//TODO: language init as undefined
  $scope.$watch('settings.language', function () {
      AppSettings.change('language', $scope.settings.language);
  });


//TODO: form id renaming
    //attach sendMail f() to the controller scope
  $scope.formSubmit = function() {
      //define the mail params as JSON, hard coded for sample code
      // update JSON to reflect message you want to send
      
      $log.debug($scope.idform);
      var mailJSON = {
          "key": AppSettings.get('emailserviceKey'),
          "message": {
              "html": $scope.idform.ctMessage,
              "text": $scope.idform.ctMessage,
              "subject": "Message sent via Mobile APP - ChineseLearn.info, " + $filter('date')('yyyy-MM-dd HH:mm:ss Z'),
              "from_email": $scope.idform.ctEmail,
              "from_name": $scope.idform.ctName,
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
      $log.debug(mailJSON);
      EmailSender.send(mailJSON);
      alert("Thanks " + $scope.idform.ctName);
  };
});
