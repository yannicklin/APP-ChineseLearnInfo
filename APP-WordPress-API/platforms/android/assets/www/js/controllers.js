angular.module('chineselearn.controllers', [])

.controller('DashCtrl', function () { })

.controller('PostsCtrl', ["$scope", "DataLoader", "$stateParams", "$log", "$filter", "$ionicLoading", "AppSettings", function ($scope, DataLoader, $stateParams, $log, $filter, $ionicLoading, AppSettings) {
    $scope.posts = null;
    $scope.RSempty = false;
    var nextPage = 1;
    $scope.NextPageIndicator = 0;

    // Get posts [under Params constraint]
    var termQueryString = 'posts';
    if ($stateParams.tagSlug) {
        termQueryString += '?filter[tag]=' + $stateParams.tagSlug;
        $scope.termQS = { Type: $filter('translate')('TAB_TITLE_TAGS'), Term: $stateParams.tagName };
    } else if ($stateParams.categorySlug) {
        termQueryString += '?filter[category_name]=' + $stateParams.categorySlug;
        $scope.termQS = { Type: $filter('translate')('TAB_TITLE_CATEGORIES'), Term: $stateParams.categoryName };
    }

    $scope.loadPosts = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get(termQueryString, 0).then(function (response) {
            if (response.data.length == 0) {
                $scope.posts = null;
                $scope.RSempty = true;
            } else {
                $scope.posts = response.data;
                if (response.data.length == AppSettings.get('wpAPIRSlimit')) {
                    nextPage++;
                    $scope.NextPageIndicator = 1;
                };
            };
            $ionicLoading.hide();
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
        });
    }
    $scope.loadPosts();

    $scope.loadNextPage = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });
        $scope.NextPageIndicator = 0;

        DataLoader.get(termQueryString + '&page=' + nextPage, 0).then(function (response) {
            if (response.data.length > 0) {
                $scope.posts = $scope.posts.concat(response.data);
                if (response.data.length == AppSettings.get('wpAPIRSlimit')) {
                    nextPage++;
                    $scope.NextPageIndicator = 1;
                };
            };
            $ionicLoading.hide();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
}])

.controller('PostDetailCtrl', ["$scope", "$stateParams", "DataLoader", "$log", "$filter", "$ionicLoading", "$ionicHistory", function ($scope, $stateParams, DataLoader, $log, $filter, $ionicLoading, $ionicHistory) {
    $scope.loadPost = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('posts/' + $stateParams.postId, 0).then(function (response) {
            $scope.post = response.data;
            $ionicLoading.hide();
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
        });
    }
    $scope.loadPost();

    $scope.closePost = function () {
        $ionicHistory.goBack();
    }
}])


.controller('TagsCtrl', ["$scope", "DataLoader", "$log", "$filter", "$ionicLoading", function ($scope, DataLoader, $log, $filter, $ionicLoading) {
    $scope.tags = null;
    $scope.RSempty = false;

    $scope.loadTags = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('tags', 1000).then(function (response) {
            if (response.data.length == 0) {
                $scope.tags = null;
                $scope.RSempty = true;
            } else {
                $scope.tags = response.data;
            };
            $ionicLoading.hide();
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
        });
    }
    $scope.loadTags();
}])


.controller('CategoriesCtrl', ["$scope", "DataLoader", "$log", "$filter", "$ionicLoading", function ($scope, DataLoader, $log, $filter, $ionicLoading) {
    $scope.categories = null;
    $scope.RSempty = false;

    $scope.loadCategories = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('categories', 100).then(function (response) {
            if (response.data.length == 0) {
                $scope.categories = null;
                $scope.RSempty = true;
            } else {
                $scope.categories = response.data;
            };
            $ionicLoading.hide();
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
        });
    }
    $scope.loadCategories();
}])


.controller('SettingsCtrl', ["$scope", "$translate", "tmhDynamicLocale", "AppSettings", "$ionicHistory", "EmailSender", "$filter", function ($scope, $translate, tmhDynamicLocale, AppSettings, $ionicHistory, EmailSender, $filter) {
    $scope.forms = {};
    $scope.ctForm = {};
    $scope.settings = {
        language: $translate.use()
    }

    // Change Lanuage and auto redirect to dash tab
    $scope.$watch('settings.language', function () {
        if ($scope.settings.language != AppSettings.get('language')) {
            AppSettings.change('language', $scope.settings.language);
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
        };
    });

    // contact form submitting
    $scope.formSubmit = function () {
        var mailJSON = {
            'api_user': AppSettings.get('sdAPIName'),
            'api_key': AppSettings.get('sdServiceKey'),
            'from': $scope.ctForm.ctEmail,
            'fromname': $scope.ctForm.ctName,
            'to': AppSettings.get('contactForm2Email'),
            'toname': AppSettings.get('contactForm2User'),
            'subject': 'Message via Mobile APP - ' + AppSettings.get('appName') + ', ' + $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm Z'),
            'date' : $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm Z'),
            'html': '<table style="border: 1px dashed black; border-collapse: collapse;">' + '<caption>' + AppSettings.get('appName') + '</caption>' +
                  '<tfoot style="color: red;"><tr><td style="border: 1px dashed black; padding: 5px;">Time</td><td style="border: 1px dashed black; padding: 5px;">' + $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm Z') + '</td></tr>' +
                  '<tr><td style="border: 1px dashed black; padding: 5px;">SPEC</td><td style="border: 1px dashed black; padding: 5px;">Platform: ' + device.platform + ', Version: ' + device.version + ', Manufacturer: ' + device.manufacturer + ', Model: ' + device.model + ', UUID: ' + device.uuid + '</td></tr></tfoot>' +
                  '<tbody><tr><td style="border: 1px dashed black; padding: 5px;">Name</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctName + '</td></tr>' +
                  '<tr><td style="border: 1px dashed black; padding: 5px;">Email</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctEmail + '</td></tr>' +
                  '<tr><td style="border: 1px dashed black; padding: 5px;">Message</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctMessage + '</td></tr></tbody></table>',
            'text': 'TEXT VERSION: ' + $scope.ctForm.ctMessage
        };
        EmailSender.send(mailJSON, $scope.ctForm.ctName);

        //reset Form
        $scope.ctForm = {};
        $scope.forms.contactForm.$setPristine();
    };
}]);
