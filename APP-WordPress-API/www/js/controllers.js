angular.module('chineselearn.controllers', [])

.controller('DashCtrl', function () {
    if (typeof analytics !== undefined) { analytics.trackView("Dashboard"); }
})

.controller('PostsCtrl', ["$scope", "DataLoader", "$stateParams", "$log", "$filter", "$ionicLoading", "AppSettings", "$timeout", "$rootScope", function ($scope, DataLoader, $stateParams, $log, $filter, $ionicLoading, AppSettings, $timeout, $rootScope) {
    $scope.posts = null;
    $scope.RSempty = false;
    var nextPage = 1;
    $scope.NextPageIndicator = 0;

    if (typeof analytics !== undefined) { analytics.trackView("Posts List"); }

    // Get posts [under Params constraint]
    var termQueryString = 'posts';
    if ($stateParams.tagSlug) {
        termQueryString += '?filter[tag]=' + $stateParams.tagSlug;
        $scope.termQS = { Type: $filter('translate')('TAB_TITLE_TAGS'), Term: $stateParams.tagName };

        if (typeof analytics !== undefined) { analytics.trackEvent('Post List Condition', 'Tag', $stateParams.tagName); }
    } else if ($stateParams.categorySlug) {
        termQueryString += '?filter[category_name]=' + $stateParams.categorySlug;
        $scope.termQS = { Type: $filter('translate')('TAB_TITLE_CATEGORIES'), Term: $stateParams.categoryName };

        if (typeof analytics !== undefined) { analytics.trackEvent('Post List Condition', 'Category', $stateParams.categoryName); }
    } else if ($stateParams.areaSlug) {
        termQueryString += '?filter[tag]=' + $stateParams.areaSlug;
        $scope.termQS = { Type: $filter('translate')('TAB_TITLE_AREAS'), Term: $stateParams.areaName };

        if (typeof analytics !== undefined) { analytics.trackEvent('Post List Condition', 'AREA', $stateParams.areaName); }
    }

    $scope.loadPosts = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
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

            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
            $rootScope.connectionFails++;
        });
    }
    $scope.loadPosts();

    $scope.loadNextPage = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
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

            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
            $rootScope.connectionFails++;
        });
    };

    $scope.reload = function () {
        $scope.posts = null;
        $scope.RSempty = false;
        var nextPage = 1;
        $scope.NextPageIndicator = 0;

        $scope.loadPosts();
    }
}])

.controller('PostDetailCtrl', ["$scope", "$stateParams", "DataLoader", "$log", "$filter", "$ionicLoading", "$ionicHistory", "$timeout", "$rootScope", function ($scope, $stateParams, DataLoader, $log, $filter, $ionicLoading, $ionicHistory, $timeout, $rootScope) {
    if (typeof analytics !== undefined) { analytics.trackView("Single Post"); }

    $scope.loadPost = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('posts/' + $stateParams.postId, 0).then(function (response) {
            $scope.post = response.data;

            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $rootScope.connectionFails++;
        });
    }
    $scope.loadPost();

    $scope.closePost = function () {
        $ionicHistory.goBack();
    }
}])


.controller('TagsCtrl', ["$scope", "DataLoader", "$log", "$filter", "$ionicLoading", "$timeout", "$rootScope", function ($scope, DataLoader, $log, $filter, $ionicLoading, $timeout, $rootScope) {
    $scope.tags = null;
    $scope.RSempty = false;

    if (typeof analytics !== undefined) { analytics.trackView("Tags List"); }

    $scope.loadTags = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('tags', 1000).then(function (response) {
            if (response.data.length == 0) {
                $scope.tags = null;
                $scope.RSempty = true;
            } else {
                $scope.tags = response.data;
            };

            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
            $rootScope.connectionFails++;
        });
    }
    $scope.loadTags();

    $scope.reload = function () {
        $scope.tags = null;
        $scope.RSempty = false;
        var nextPage = 1;
        $scope.NextPageIndicator = 0;

        $scope.loadTags();
    }
}])

.controller('CategoriesCtrl', ["$scope", "DataLoader", "$log", "$filter", "$ionicLoading", "$timeout", "$rootScope", function ($scope, DataLoader, $log, $filter, $ionicLoading, $timeout, $rootScope) {
    $scope.categories = null;
    $scope.RSempty = false;

    if (typeof analytics !== undefined) { analytics.trackView("Categories List"); }

    $scope.loadCategories = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('categories', 100).then(function (response) {
            if (response.data.length == 0) {
                $scope.categories = null;
                $scope.RSempty = true;
            } else {
                $scope.categories = response.data;
            };

            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
        }, function (response) {
            $log.error('error', response);
            $ionicLoading.hide();
            $scope.RSempty = true;
            $rootScope.connectionFails++;
        });
    }
    $scope.loadCategories();

    $scope.reload = function () {
        $scope.categories = null;
        $scope.RSempty = false;
        var nextPage = 1;
        $scope.NextPageIndicator = 0;

        $scope.loadCategories();
    }
}])

    .controller('AreasCtrl', ["$scope", "DataLoader", "$log", "$filter", function ($scope, DataLoader, $log, $filter) {
        // use d3 in controller
        var width = window.screen.width, height = window.screen.height;
        //var width = window.screen.width * window.devicePixelRatio, height = window.screen.height * window.devicePixelRatio;
        var vis = d3.select("#map").append("svg").attr("width", width).attr("height", height);

        d3.json("../geo/twCounty2016.topo.json", function (error, data) {

            var twCounty = topojson.feature(data, data.objects["county"]);

            var density = { "taipei": 10, "ilan": 2, "hsinchu": 1 };

            for (idx = twCounty.features.length - 1; idx >= 0; idx--) {
                twCounty.features[idx].properties.postCount = ((density[twCounty.features[idx].properties.Name] > 0) ? (density[twCounty.features[idx].properties.Name]) : (0));
            }

            // Create a unit projection.
            var projection = d3.geo.mercator()
                .scale(1)
                .translate([0, 0]);

            // Create a path generator.
            var path = d3.geo.path()
                .projection(projection);

            var b = path.bounds(twCounty), s = .90 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height), t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
            
            $log.debug("s is " + s + ",t is " + t + ",center is [" + (b[0][0] + b[1][0]) / 2 + "," + (b[0][1] + b[1][1]) / 2 + "]");

            projection
                .scale(s)
                .translate(t);

            vis.selectAll("path").data(twCounty.features)
                .enter().append("path")
                .attr("d", path)
                .attr("id", function (d) { return d.properties.County_ID; })
                .style("fill", "darkgrey")
                .style("stroke-width", "2")
                .style("stroke", "white")
                .on("click", click)
                .append("text")
                .attr("dy", ".35em")
                .text(function (d) { return d.properties.postCount; })
                .attr("text-anchor", "middle")
                .attr('fill', 'white');
        });

        function click(d) {
            alert("Click on " + d.properties.County_ID + ", post is " + d.properties.postCount);
        };


    }])

.controller('SettingsCtrl', ["$scope", "$translate", "tmhDynamicLocale", "AppSettings", "$ionicHistory", "EmailSender", "$filter", "$window", function ($scope, $translate, tmhDynamicLocale, AppSettings, $ionicHistory, EmailSender, $filter, $window) {
    $scope.forms = {};
    $scope.ctForm = {};
    $scope.settings = {
        language: $translate.use()
    }

    if (typeof analytics !== undefined) { analytics.trackView("Settings"); }

    //Decide device current width
    $scope.narrowformat = 1;
    $scope.recalDimensions = function () {
        if ($window.innerWidth < $window.innerHeight || $window.innerWidth < 479) {
            $scope.narrowformat = 1;
        } else {
            $scope.narrowformat = 0;
        }

        if (typeof analytics !== undefined) { analytics.trackEvent('Device', 'Orientation', 'toPortrait', $scope.narrowformat); }
    }
    $scope.recalDimensions();
    angular.element($window).bind('resize', function () {
        $scope.$apply(function () {
            $scope.recalDimensions();
        })
    });

    // Change Lanuage and auto redirect to dash tab
    $scope.$watch('settings.language', function () {
        if ($scope.settings.language != AppSettings.get('language')) {
            AppSettings.change('language', $scope.settings.language);
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();

            if (typeof analytics !== undefined) { analytics.trackEvent('Interface', 'Language', $scope.settings.language); }
        };
    });

    // contact form submitting
    $scope.formSubmit = function () {
        var mailJSON = {
            'username': AppSettings.get('eeAPIName'),
            'api_key': AppSettings.get('eeServiceKey'),
            'from': $scope.ctForm.ctEmail,
            'from_name': $scope.ctForm.ctName,
            'to': AppSettings.get('contactForm2Email'),
            'subject': 'Message via Mobile APP - ' + AppSettings.get('appName') + ', ' + $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm Z'),
            'body_html': '<table style="border: 1px dashed black; border-collapse: collapse;">' + '<caption>' + AppSettings.get('appName') + '</caption>' +
                  '<tfoot style="color: red;"><tr><td style="border: 1px dashed black; padding: 5px;">Time</td><td style="border: 1px dashed black; padding: 5px;">' + $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm Z') + '</td></tr>' +
                  '<tr><td style="border: 1px dashed black; padding: 5px;">SPEC</td><td style="border: 1px dashed black; padding: 5px;">Platform: ' + device.platform + ', Version: ' + device.version + ', Manufacturer: ' + device.manufacturer + ', Model: ' + device.model + ', UUID: ' + device.uuid + '</td></tr></tfoot>' +
                  '<tbody><tr><td style="border: 1px dashed black; padding: 5px;">Name</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctName + '</td></tr>' +
                  '<tr><td style="border: 1px dashed black; padding: 5px;">Email</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctEmail + '</td></tr>' +
                  '<tr><td style="border: 1px dashed black; padding: 5px;">Message</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctMessage + '</td></tr></tbody></table>',
            'body_text': 'TEXT VERSION: ' + $scope.ctForm.ctMessage
        };
        EmailSender.send(mailJSON, $scope.ctForm.ctName);

        //reset Form
        $scope.ctForm = {};
        $scope.forms.contactForm.$setPristine();

        if (typeof analytics !== undefined) { analytics.trackEvent('Email', 'ContactUs'); }
    };
}]);
