angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PostsCtrl', function ($scope, DataLoader, $timeout, $log, $ionicLoading) {

    $scope.moreItems = false;

    $scope.loadPosts = function() {

        // Get all of our posts
        DataLoader.get('', 'posts' ).then(function(response) {

            $scope.posts = response.data;

            $scope.moreItems = true;

            $log.log(postsAPI, response.data);
            $ionicLoading.hide();
        }, function(response) {
            $log.log(postsAPI, response.data);
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

            DataLoader.get( '' + '?page=' + pg ).then(function(response) {

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

    .controller('Posts-CHTCtrl', function ($scope, DataLoader, $timeout, $log, $ionicLoading) {

        $scope.loadPosts = function () {

            // Get all of our posts
            DataLoader.get('zh-hant/', 'posts').then(function (response) {

                $scope.posts = response.data;

                $scope.moreItems = true;

                $log.log(postsAPI, response.data);
                $ionicLoading.hide();
            }, function (response) {
                $log.log(postsAPI, response.data);
                $ionicLoading.hide();
            });

        }

        // Load posts on page load
        $scope.loadPosts();


        // Pull to refresh
        $scope.doRefresh = function () {

            $timeout(function () {

                $scope.loadPosts();

            }, 1000);

        };

    })

.controller('PostDetailCtrl', function ($scope, $stateParams, DataLoader, $sce, $timeout, $log, $ionicLoading) {

    $scope.loadPost = function() {

        DataLoader.get('', 'posts/' + $stateParams.postId).then(function (response) {

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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
