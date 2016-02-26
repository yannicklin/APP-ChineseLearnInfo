angular.module('chineselearn.services', [])

.factory('DataLoader', ["$http", "AppSettings", function ($http, AppSettings) {
    return {
        get: function ($term, $limit) {
            var result = $http({
                method: 'GET',
                url: AppSettings.getURI($term, $limit),
                timeout: AppSettings.get('wpConnectTimeout')
            });
            return result;
        }
    }
}])

.factory('EmailSender', ["$http", "$log", "AppSettings", "$timeout", "toaster", "$filter", function ($http, $log, AppSettings, $timeout, toaster, $filter) {
    return {
        send: function ($mail, $sendername) {
            $http({
                method: 'POST',
                url: AppSettings.get('eeAPIURI'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj) {
                        if (obj[p].length > 0) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
                    }
                    return str.join('&');
                },
                data: $mail,
                timeout: AppSettings.get('eeConnectTimeout')
            }).then(
            function success() {
                $timeout(function () {
                    toaster.pop({
                    type: 'info',
                    body: $filter('translate')('ALERT_MAIL_SENT', { name: $sendername }),
                    toasterId: 2
                });
                }, 0);
            }, function error() {
                $log.debug('error sending email.');
            });
            return null;
        }
    }
}])

.factory('PHPJSfunc', function () {
    return {
        urlencode: function ($uri) {
            $uri = ($uri + '').toString();
            var result = encodeURIComponent($uri)
              .replace(/!/g, '%21')
              .replace(/'/g, '%27')
              .replace(/\(/g, '%28')
              .replace(/\)/g, '%29')
              .replace(/\*/g, '%2A')
              .replace(/%20/g, '+');
            return result;
        }
    }
})

.factory('AppSettings', ["AppConfig", "$translate", "tmhDynamicLocale", function (AppConfig, $translate, tmhDynamicLocale) {
    function setLanguageURI(value) {
        switch (value) {
            case 'en':
                savedData.languageURI = '';
                break;
            case 'zh':
                savedData.languageURI = 'zh-hant/';
                break;
            default:
                savedData.languageURI = '';
                //savedData.languageURI = value + '/';
        }
    }

    var savedData = AppConfig;
    // Set Language and LanguageURI
    savedData.language = $translate.use();
    setLanguageURI(savedData.language);

    return {
        change: function ($item, value) {
            savedData[$item] = value;
            if ($item == 'language') {
                setLanguageURI(value);
                $translate.use(value);
                tmhDynamicLocale.set(value);
            }
        },
        get: function ($item) {
            return savedData[$item];
        },
        getURI: function ($term, $limit) {
            ($limit == 0) ? ($limit = savedData.wpAPIRSlimit) : ($limit = $limit);
            if ($term.indexOf('?') < 0) {
                return savedData.domainURI + savedData.languageURI + savedData.wpAPIURI + $term + '?' + savedData.wpAPIURIsuffix + $limit;
            } else {
                return savedData.domainURI + savedData.languageURI + savedData.wpAPIURI + $term + '&' + savedData.wpAPIURIsuffix + $limit;
            };
        }
    };
}]);