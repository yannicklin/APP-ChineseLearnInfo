angular.module("chineselearn", ["ionic", "ngCookies", "ngMessages", "pascalprecht.translate", "tmh.dynamicLocale", "toaster", "LocalForageModule", "chineselearn.config", "chineselearn.controllers", "chineselearn.directives", "chineselearn.filters", "chineselearn.services"]).run(["$ionicPlatform", "$ionicHistory", "toaster", "$filter", "$timeout", function (rootjQuery, dataAndEvents, c, cb, ready) {
    if (rootjQuery.ready(function () {
        /**
         * @return {undefined}
         */
      function completed() {
        ready(function () {
          c.pop({
        type: "error",
        body: cb("translate")("INTERNET_CONNECTION_NONE"),
        toasterId: 1
    });
    }, 0);
    }
      cordova.plugins.Keyboard.disableScroll(true);
      if (window.StatusBar) {
        if (!ionic.Platform.isAndroid()) {
          StatusBar.styleLightContent();
    }
    }
      document.addEventListener("offline", completed, false);
    }), ionic.Platform.isAndroid()) {
        /** @type {boolean} */
        var o = false;
        rootjQuery.registerBackButtonAction(function (types) {
            return types.preventDefault(), o ? ionic.Platform.exitApp() : (o = true, ready(function () {
                c.pop({
                    type: "error",
                    body: cb("translate")("CONFIRM_BEFORE_APP_EXIT"),
                    toasterId: 1
                });
            }, 0), ready(function () {
                /** @type {boolean} */
                o = false;
            }, 5E3)), false;
        }, 101);
    }
}]).config(["$httpProvider", "$ionicConfigProvider", "$localForageProvider", "tmhDynamicLocaleProvider", "$translateProvider", "$stateProvider", "$urlRouterProvider", function ($http, ctrl, results, tmhDynamicLocaleProvider, $translateProvider, $stateProvider, $urlRouterProvider) {
    /** @type {boolean} */
    $http.defaults.useXDomain = true;
    ctrl.tabs.position("bottom");
    tmhDynamicLocaleProvider.localeLocationPattern("locales/angular-locale_{{locale}}.js");
    $translateProvider.useStaticFilesLoader({
        prefix: "i18n/",
        suffix: ".json"
    }).registerAvailableLanguageKeys(["ar", "bn", "de", "en", "es", "fr", "hi", "id", "ja", "ms", "pt", "ru", "ur", "zh"], {
        ar: "ar",
        "ar_*": "ar",
        bn: "bn",
        "bn_*": "bn",
        de: "de",
        "de_*": "de",
        en: "en",
        "en_*": "en",
        es: "es",
        "es_*": "es",
        fr: "fr",
        "fr_*": "fr",
        hi: "hi",
        "hi_*": "hi",
        id: "id",
        "id_*": "id",
        ja: "ja",
        "ja_*": "ja",
        ms: "ms",
        "ms_*": "ms",
        pt: "pt",
        "pt_*": "pt",
        ru: "ru",
        "ru_*": "ru",
        ur: "ur",
        "ur_*": "ur",
        zh: "zh",
        "zh_*": "zh"
    }).preferredLanguage("zh").determinePreferredLanguage().fallbackLanguage(["en", "zh", "es", "fr"]).useSanitizeValueStrategy("escapeParameters").useLocalStorage();
    results.config({
        name: "ChineseLearnInfo",
        storeName: "prePOSTS",
        description: "Let user to keep their preference on Chinese Learn Information News on mobile."
    });
    $stateProvider.state("tab", {
        url: "/tab",
        "abstract": true,
        templateUrl: "templates/tabs.html"
    }).state("tab.dash", {
        url: "/dash",
        views: {
            "tab-dash": {
                templateUrl: "templates/tab-dash.html",
                controller: "DashCtrl"
            }
        }
    }).state("tab.posts", {
        url: "/posts",
        cache: false,
        views: {
            "tab-posts": {
                templateUrl: "templates/tab-posts.html",
                controller: "PostsCtrl"
            }
        }
    }).state("tab.post-detail", {
        url: "/posts/:postId",
        views: {
            "tab-posts": {
                templateUrl: "templates/post-detail.html",
                controller: "PostDetailCtrl"
            }
        }
    }).state("tab.tags", {
        url: "/tags",
        cache: false,
        views: {
            "tab-tags": {
                templateUrl: "templates/tab-tags.html",
                controller: "TagsCtrl"
            }
        }
    }).state("tab.tag-posts", {
        url: "/tagposts/:tagSlug/:tagName",
        views: {
            "tab-posts": {
                templateUrl: "templates/tab-posts.html",
                controller: "PostsCtrl"
            }
        }
    }).state("tab.categories", {
        url: "/categories",
        cache: false,
        views: {
            "tab-categories": {
                templateUrl: "templates/tab-categories.html",
                controller: "CategoriesCtrl"
            }
        }
    }).state("tab.category-posts", {
        url: "/categoryposts/:categorySlug/:categoryName",
        views: {
            "tab-posts": {
                templateUrl: "templates/tab-posts.html",
                controller: "PostsCtrl"
            }
        }
    }).state("tab.settings", {
        url: "/settings",
        views: {
            "tab-settings": {
                templateUrl: "templates/tab-settings.html",
                controller: "SettingsCtrl"
            }
        }
    });
    $urlRouterProvider.otherwise("/tab/dash");
}]), angular.module("chineselearn.config", []).constant("AppConfig", {
    appName: "Chinese Learn Information",
    domainURI: "https://chineselearn.info/",
    wpAPIURI: "wp-json/wp/v2/",
    wpAPIKey: "",
    wpAPISecret: "",
    wpAPIURIsuffix: "filter[orderby]=id&filter[order]=ASC&filter[limit]=",
    wpAPIRSlimit: 10,
    wpConnectTimeout: 5E3,
    mdAPIName: "",
    mdServiceKey: "e8yCnUcg1OaKz0dWIhIH7w",
    mdAPIURI: "https://mandrillapp.com/api/1.0/messages/send.json",
    contactForm2Email: "support@chineselearn.info",
    contactForm2User: "Support",
    mdConnectTimeout: 1E4
}), angular.module("chineselearn.services", []).factory("DataLoader", ["$http", "AppSettings", function (request, uri) {
    return {
        /**
         * @param {string} key
         * @param {number} recurring
         * @return {?}
         */
        get: function (key, recurring) {
            var req = request({
                method: "GET",
                url: uri.getURI(key, recurring),
                timeout: uri.get("wpConnectTimeout")
            });
            return req;
        }
    };
}]).factory("PHPJSfunc", function () {
    return {
        /**
         * @param {string} str
         * @return {?}
         */
        urlencode: function (str) {
            /** @type {string} */
            str = (str + "").toString();
            /** @type {string} */
            var urlencode = encodeURIComponent(str).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
            return urlencode;
        }
    };
}).factory("EmailSender", ["$http", "$log", "toaster", "AppSettings", function ($http, utils, c, $templateCache) {
    return {
        /**
         * @param {?} data
         * @return {?}
         */
        send: function (data) {
            return $http.post($templateCache.get("mdAPIURI"), data).success(function () {
                c.pop({
                    type: "info",
                    body: $filter("translate")("ALERT_MAIL_SENT", {
                        name: $sendername
                    }),
                    toasterId: 2
                });
            }).error(function () {
                utils.debug("error sending email.");
            }), null;
        }
    };
}]).factory("AppSettings", ["AppConfig", "$translate", "tmhDynamicLocale", function (Util, app, engine) {
    /**
     * @param {?} tablePath
     * @return {undefined}
     */
    function loadMe(tablePath) {
        switch (tablePath) {
            case "en":
                /** @type {string} */
                u.languageURI = "";
                break;
            case "zh":
                /** @type {string} */
                u.languageURI = "zh-hant/";
                break;
            default:
                /** @type {string} */
                u.languageURI = "";
        }
    }
    var u = Util;
    return u.language = app.use(), loadMe(u.language), {
        /**
         * @param {string} n
         * @param {?} q
         * @return {undefined}
         */
        change: function (n, q) {
            u[n] = q;
            if ("language" == n) {
                loadMe(q);
                app.use(q);
                engine.set(q);
            }
        },
        /**
         * @param {string} key
         * @return {?}
         */
        get: function (key) {
            return u[key];
        },
        /**
         * @param {string} xs
         * @param {number} deepDataAndEvents
         * @return {?}
         */
        getURI: function (xs, deepDataAndEvents) {
            return deepDataAndEvents = 0 == deepDataAndEvents ? u.wpAPIRSlimit : deepDataAndEvents, -1 === xs.indexOf("?") ? u.domainURI + u.languageURI + u.wpAPIURI + xs + "?" + u.wpAPIURIsuffix + deepDataAndEvents : u.domainURI + u.languageURI + u.wpAPIURI + xs + "&" + u.wpAPIURIsuffix + deepDataAndEvents;
        }
    };
}]), angular.module("chineselearn.controllers", []).controller("DashCtrl", ["$scope", function (dataAndEvents) {
}]).controller("PostsCtrl", ["$scope", "DataLoader", "$stateParams", "$log", "$filter", "$ionicLoading", "AppSettings", function ($scope, storage, postData, $log, cb, parent, $templateCache) {
    var storageKey;
    if (postData.tagSlug) {
        /** @type {string} */
        storageKey = "posts?filter[tag]=" + postData.tagSlug;
        $scope.termQS = {
            Type: "TAB_TITLE_TAGS",
            Term: postData.tagName
        };
    } else {
        if (postData.categorySlug) {
            /** @type {string} */
            storageKey = "posts?filter[category_name]=" + postData.categorySlug;
            $scope.termQS = {
                Type: "TAB_TITLE_CATEGORIES",
                Term: postData.categoryName
            };
        } else {
            /** @type {string} */
            storageKey = "posts";
        }
    }
    parent.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
    });
    /** @type {boolean} */
    $scope.RSempty = false;
    /** @type {number} */
    var key = 1;
    /** @type {number} */
    $scope.MoreResultsIndicator = 0;
    /**
     * @return {undefined}
     */
    $scope.loadPosts = function () {
        storage.get(storageKey, 0).then(function (results) {
            if (0 == results.data.length) {
                /** @type {null} */
                $scope.posts = null;
                /** @type {boolean} */
                $scope.RSempty = true;
            } else {
                $scope.posts = results.data;
                if (results.data.length == $templateCache.get("wpAPIRSlimit")) {
                    key++;
                    /** @type {number} */
                    $scope.MoreResultsIndicator = 1;
                }
            }
            parent.hide();
        }, function (status) {
            $log.error("error", status);
            parent.hide();
            /** @type {boolean} */
            $scope.RSempty = true;
        });
    };
    $scope.loadPosts();
    /**
     * @return {undefined}
     */
    $scope.loadMore = function () {
        parent.show({
            template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
        });
        /** @type {number} */
        $scope.MoreResultsIndicator = 0;
        storage.get("tags?page=" + key, 0).then(function (net) {
            if (net.data.length > 0) {
                $scope.posts = $scope.posts.concat(net.data);
                if (net.data.length == $templateCache.get("wpAPIRSlimit")) {
                    key++;
                    /** @type {number} */
                    $scope.MoreResultsIndicator = 1;
                }
            }
            parent.hide();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, function (status) {
            $log.error("error", status);
            parent.hide();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        });
    };
}]).controller("PostDetailCtrl", ["$ionicHistory", "$scope", "$stateParams", "DataLoader", "$log", "$filter", "$ionicLoading", function ($history, $scope, comment, $templateCache, test, cb, parent) {
    parent.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
    });
    /** @type {boolean} */
    $scope.RSempty = false;
    /**
     * @return {undefined}
     */
    $scope.loadPost = function () {
        $templateCache.get("posts/" + comment.postId, 0).then(function (result) {
            $scope.post = result.data;
            parent.hide();
        }, function (errmsg) {
            test.error("error", errmsg);
            parent.hide();
            /** @type {boolean} */
            $scope.RSempty = true;
        });
    };
    $scope.loadPost();
    /**
     * @return {undefined}
     */
    $scope.closePost = function () {
        $history.goBack();
    };
}]).controller("TagsCtrl", ["$scope", "DataLoader", "$log", "$filter", "$ionicLoading", "AppSettings", function ($scope, cl, $log, cb, parent, $templateCache) {
    parent.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
    });
    /** @type {boolean} */
    $scope.RSempty = false;
    /** @type {number} */
    var sid = 1;
    /** @type {number} */
    $scope.MoreResultsIndicator = 0;
    /**
     * @return {undefined}
     */
    $scope.loadTags = function () {
        cl.get("tags", 0).then(function (data) {
            if (0 == data.data.length) {
                /** @type {null} */
                $scope.tags = null;
                /** @type {boolean} */
                $scope.RSempty = true;
            } else {
                $scope.tags = data.data;
                if (data.data.length == $templateCache.get("wpAPIRSlimit")) {
                    sid++;
                    /** @type {number} */
                    $scope.MoreResultsIndicator = 1;
                }
            }
            parent.hide();
        }, function (status) {
            $log.error("error", status);
            parent.hide();
            /** @type {boolean} */
            $scope.RSempty = true;
        });
    };
    $scope.loadTags();
    /**
     * @return {undefined}
     */
    $scope.loadMore = function () {
        parent.show({
            template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
        });
        /** @type {number} */
        $scope.MoreResultsIndicator = 0;
        cl.get("tags?page=" + sid, 0).then(function (net) {
            if (net.data.length > 0) {
                $scope.tags = $scope.tags.concat(net.data);
                if (net.data.length == $templateCache.get("wpAPIRSlimit")) {
                    sid++;
                    /** @type {number} */
                    $scope.MoreResultsIndicator = 1;
                }
            }
            parent.hide();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, function (status) {
            $log.error("error", status);
            parent.hide();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        });
    };
}]).controller("CategoriesCtrl", ["$scope", "DataLoader", "$log", "$filter", "$ionicLoading", "AppSettings", function ($scope, cl, $log, cb, parent, $templateCache) {
    parent.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
    });
    /** @type {boolean} */
    $scope.RSempty = false;
    /** @type {number} */
    var sid = 1;
    /** @type {number} */
    $scope.MoreResultsIndicator = 0;
    /**
     * @return {undefined}
     */
    $scope.loadCategories = function () {
        cl.get("categories", 0).then(function (item) {
            if (0 == item.data.length) {
                /** @type {null} */
                $scope.categories = null;
                /** @type {boolean} */
                $scope.RSempty = true;
            } else {
                $scope.categories = item.data;
                if (item.data.length == $templateCache.get("wpAPIRSlimit")) {
                    sid++;
                    /** @type {number} */
                    $scope.MoreResultsIndicator = 1;
                }
            }
            parent.hide();
        }, function (status) {
            $log.error("error", status);
            parent.hide();
            /** @type {boolean} */
            $scope.RSempty = true;
        });
    };
    $scope.loadCategories();
    /**
     * @return {undefined}
     */
    $scope.loadMore = function () {
        parent.show({
            template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>' + cb("translate")("LOADING_MORE_TEXT")
        });
        /** @type {number} */
        $scope.MoreResultsIndicator = 0;
        cl.get("categories?page=" + sid, 0).then(function (net) {
            if (net.data.length > 0) {
                $scope.categories = $scope.categories.concat(net.data);
                if (net.data.length == $templateCache.get("wpAPIRSlimit")) {
                    sid++;
                    /** @type {number} */
                    $scope.MoreResultsIndicator = 1;
                }
            }
            parent.hide();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }, function (status) {
            $log.error("error", status);
            parent.hide();
            $scope.$broadcast("scroll.infiniteScrollComplete");
        });
    };
}]).controller("SettingsCtrl", ["$scope", "$translate", "tmhDynamicLocale", "AppSettings", "$ionicHistory", "EmailSender", "$filter", "$state", function ($scope, chai, dataAndEvents, item, MessageService, client, $, deepDataAndEvents) {
    $scope.forms = {};
    $scope.ctForm = {};
    $scope.settings = {
        language: chai.use()
    };
    $scope.$watch("settings.language", function () {
        if ($scope.settings.language != item.get("language")) {
            item.change("language", $scope.settings.language);
            MessageService.clearCache();
            MessageService.clearHistory();
        }
    });
    /**
     * @return {undefined}
     */
    $scope.formSubmit = function () {
        var opts = {
            key: item.get("mdServiceKey"),
            message: {
                html: '<table style="border: 1px dashed black; border-collapse: collapse;"><caption>' + item.get("appName") + '</caption><tfoot style="color: red;"><tr><td style="border: 1px dashed black; padding: 5px;">Time</td><td style="border: 1px dashed black; padding: 5px;">' + $("date")(Date.now(), "yyyy-MM-dd HH:mm Z") + '</td></tr><tr><td style="border: 1px dashed black; padding: 5px;">SPEC</td><td style="border: 1px dashed black; padding: 5px;">Platform: ' + device.platform + ", Version: " + device.version +
                ", Manufacturer: " + device.manufacturer + ", Model: " + device.model + ", UUID: " + device.uuid + '</td></tr></tfoot><tbody><tr><td style="border: 1px dashed black; padding: 5px;">Name</td><td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctName + '</td></tr><tr><td style="border: 1px dashed black; padding: 5px;">Email</td><td style="border: 1px dashed black; padding: 5px;">' + $scope.ctForm.ctEmail + '</td></tr><tr><td style="border: 1px dashed black; padding: 5px;">Message</td><td style="border: 1px dashed black; padding: 5px;">' +
                $scope.ctForm.ctMessage + "</td></tr></tbody></table>",
                text: "TEXT VERSION: " + $scope.ctForm.ctMessage,
                subject: "Message sent via Mobile APP - " + item.get("appName") + ", " + $("date")(Date.now(), "yyyy-MM-dd HH:mm Z"),
                from_email: $scope.ctForm.ctEmail,
                from_name: $scope.ctForm.ctName,
                to: [{
                    email: item.get("contactForm2Email"),
                    name: item.get("contactForm2User"),
                    type: "to"
                }],
                important: false,
                track_opens: null,
                track_clicks: null,
                auto_text: null,
                auto_html: null,
                inline_css: null,
                url_strip_qs: null,
                preserve_recipients: null,
                view_content_link: null,
                tracking_domain: null,
                signing_domain: null,
                return_path_domain: null
            },
            async: false,
            ip_pool: "Main Pool"
        };
        client.send(opts, $scope.ctForm.ctName);
        $scope.ctForm = {};
        $scope.forms.contactForm.$setPristine();
    };
}]), angular.module("chineselearn.directives", []).directive("gpRadio", function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            model: "=ngModel",
            value: "=gpRadio"
        },
        /**
         * @param {Attr} scope
         * @param {Object} elm
         * @param {?} tabCtrl
         * @param {?} model
         * @return {undefined}
         */
        link: function (scope, elm, tabCtrl, model) {
            elm.addClass("button");
            elm.on("click", function (dataAndEvents) {
                scope.$apply(function () {
                    model.$setViewValue(scope.value);
                });
            });
            scope.$watch("model", function (value) {
                elm.removeClass("button-positive");
                if (value === scope.value) {
                    elm.addClass("button-positive");
                }
            });
        }
    };
}).directive("keyInput", function () {
    return function (scope, $swipe, iAttrs) {
        $swipe.bind("keydown keypress", function (event) {
            if (13 === event.which) {
                scope.$apply(function () {
                    scope.$eval(iAttrs.keyInput);
                });
                event.preventDefault();
            }
        });
    };
}).directive("keyboardHide", ["$window", function ($window) {
    return {
        restrict: "A",
        /**
         * @param {?} tabCtrl
         * @param {Node} elm
         * @param {?} scope
         * @return {undefined}
         */
        link: function (tabCtrl, elm, scope) {
            angular.element($window).bind("native.keyboardshow", function () {
                elm.addClass("hide");
            });
            angular.element($window).bind("native.keyboardhide", function () {
                elm.removeClass("hide");
            });
        }
    };
}]).directive("keyboardHide4tabs", ["$window", function ($window) {
    return {
        restrict: "A",
        /**
         * @param {?} tabCtrl
         * @param {Node} elm
         * @param {?} scope
         * @return {undefined}
         */
        link: function (tabCtrl, elm, scope) {
            angular.element($window).bind("native.keyboardshow", function () {
                elm.addClass("tabs-item-hide");
            });
            angular.element($window).bind("native.keyboardhide", function () {
                elm.removeClass("tabs-item-hide");
            });
        }
    };
}]), angular.module("chineselearn.filters", []).filter("partRemove", ["$sce", function (assert) {
    return function (xhtml, a) {
        /** @type {Element} */
        var e = document.createElement("div");
        /** @type {string} */
        e.innerHTML = xhtml;
        /** @type {NodeList} */
        var items = e.getElementsByTagName(a);
        /** @type {number} */
        var count = items.length;
        for (; count > 0; count--) {
            items[count - 1].parentNode.removeChild(items[count - 1]);
        }
        return assert.trustAsHtml(e.outerHTML);
    };
}]).filter("lengthLimit", ["$sce", function (assert) {
    return function (text, lastIndex) {
        /** @type {Element} */
        var temp = document.createElement("div");
        return text = String(text), text.length > lastIndex ? temp.innerHTML = text.substring(0, lastIndex) + " ... " : temp.innerHTML = text, assert.trustAsHtml(temp.outerHTML);
    };
}]).filter("unicode", ["$sce", function ($sce) {
    return function (newVal) {
        return $sce.trustAsHtml(newVal);
    };
}]).filter("unescapeHTML", function () {
    var attrs = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    return function (text) {
        return angular.forEach(attrs, function (r, boundary) {
            /** @type {string} */
            text = String(text).replace(new RegExp(r, "gi"), boundary);
        }), text;
    };
});
