angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PostsCtrl', function ($scope, $http) {

    $http.get(DOMAIN_POST_URI)
        .success(function (response) {
            $scope.posts = response;
        });
})

.controller('PostDetailCtrl', function ($scope, $stateParams, Posts) {

    $http.get(DOMAIN_POST_URI + "/" + $stateParams.postId)
            .success(function (response) {
                $scope.post = response;
            });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
