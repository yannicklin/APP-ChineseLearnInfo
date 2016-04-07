angular.module('chineselearn.controllers', [])

.controller('DashCtrl', function () {
    if (typeof analytics !== undefined) { analytics.trackView("Dashboard"); }
})

.controller('PostsCtrl', ["$scope", "DataLoader", "$stateParams", "$log", "$filter", "$ionicLoading", "AppSettings", "$timeout", "$rootScope", "$state", "$ionicHistory", function ($scope, DataLoader, $stateParams, $log, $filter, $ionicLoading, AppSettings, $timeout, $rootScope, $state, $ionicHistory) {
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
        $scope.termQS = { Type: $filter('translate')('TAB_TITLE_AREAS'), Term: $filter('translate')('AREAS-'+$stateParams.areaName) };

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

        DataLoader.get(termQueryString + '?page=' + nextPage, 0).then(function (response) {
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

    $scope.cleanCondition = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.posts');
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


.controller('TagsCtrl', ["AppSettings", "$scope", "DataLoader", "$log", "$filter", "$ionicLoading", "$timeout", "$rootScope", function (AppSettings, $scope, DataLoader, $log, $filter, $ionicLoading, $timeout, $rootScope) {
    $scope.tags = null;
    $scope.RSempty = false;
    var removeList = AppSettings.get('areaList');

    if (typeof analytics !== undefined) { analytics.trackView("Tags List"); }

    $scope.loadTags = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
        });

        DataLoader.get('tags', 100).then(function (response) {
            if (response.data.length == 0) {
                $scope.tags = null;
                $scope.RSempty = true;
            } else {
                $scope.tags = response.data;

                // Remove Tags belongs to Area
                angular.forEach(removeList, function (value1, key1) {
                    angular.forEach($scope.tags, function (value2, key2) {
                        var strTag2Remove = ((AppSettings.get('languageURI').length > 0) ? (value1 + "-" + AppSettings.get('languageURI').replace('/', '')) : (value1));
                        if (strTag2Remove === value2.slug) { $scope.tags.splice(key2, 1); }
                    });
                });

                if ($scope.tags.length == 0) {
                    $scope.RSempty = true;
                }
            }

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

.controller('AreasCtrl', ["AppSettings", "$state", "$scope", "DataLoader", "$log", "$filter", "$ionicLoading", "$timeout", "$rootScope", function (AppSettings, $state, $scope, DataLoader, $log, $filter, $ionicLoading, $timeout, $rootScope) {
    var arrPostCont = {}, areaList = AppSettings.get('areaList');

    if (typeof analytics !== undefined) { analytics.trackView("Area Map"); }

    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' + $filter('translate')('LOADING_TEXT')
    });

    DataLoader.get('tags', 100).then(function (response) {
        if (response.data.length > 0) {
            // Remove Tags belongs to Area
            angular.forEach(areaList, function (value1, key1) {
                var strTag2Append = ((AppSettings.get('languageURI').length > 0) ? (value1 + "-" + AppSettings.get('languageURI').replace('/', '')) : (value1));
                angular.forEach(response.data, function (value2, key2) {
                    if (strTag2Append == value2.slug) { arrPostCont[value1] = value2.count; }
                });
            });
        }

        $timeout(function () {
            
            var width = window.screen.width * 0.8, height = window.screen.height * 0.8;
            //var width = window.screen.width * 0.8 * window.devicePixelRatio, height = window.screen.height * 0.8 * window.devicePixelRatio;
            var vis = d3.select("#map").append("svg").attr("width", width).attr("height", height);

            d3.json("./geo/twMetropolitanArea2016.topo.json", function (error, data) {

                var twArea = topojson.feature(data, data.objects["MACollection"]);
                // Set the post count per Area
                for (idx = twArea.features.length - 1; idx >= 0; idx--) {
                    twArea.features[idx].properties.postCount = ((arrPostCont[("tw-" + twArea.features[idx].properties.Name)] > 0) ? (arrPostCont[("tw-" + twArea.features[idx].properties.Name)]) : (0));
                }

                // Create a unit projection and the path generator
                var projection = d3.geo.mercator()
                    .scale(1)
                    .translate([0, 0]);
                var path = d3.geo.path()
                    .projection(projection);

                // Calcualte and resize the path to fit the screen
                var b = path.bounds(twArea),
                    s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
                projection
                    .scale(s)
                    .translate(t);

                // Draw Map with Post Counts
                vis.selectAll("path").data(twArea.features)
                    .enter().append("path")
                    .attr("d", path)
                    .attr("id", function (d) { return d.properties.County_ID; })
                    .style("fill", "darkgrey")
                    .style("stroke-width", "2")
                    .style("stroke", "white")
                    .on("click", ClickonArea);

                vis.selectAll("label").data(twArea.features)
                    .enter().append("text")
                    .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
                    .attr("text-anchor", "middle")
                    .attr("dy", "0.35em")
                    .attr("font-size", "2em")
                    .attr("fill", "red")
                    .text(function (d) { return d.properties.postCount; })
                    .on("click", ClickonArea);

                function ClickonArea(data) {
                    var areaSlug = "tw-" + data.properties.Name + ((AppSettings.get('languageURI').length > 0) ? ("-" + AppSettings.get('languageURI').replace('/', '')) : (""));
                    $state.go('tab.areas-posts', { "areaSlug": areaSlug, "areaName": data.properties.Name });
                };
            });

            $ionicLoading.hide();
        }, 500);
    }, function (response) {
        $log.error('error', response);
        $ionicLoading.hide();
        $rootScope.connectionFails++;
    });
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
