angular.module('chineselearn.services', [])

.factory('DataLoader', function ($http, $log, AppSettings) {
    return {
        get: function ($term) {
            var url = AppSettings.getURI() + $term;
            $log.debug(url);
            return $http.get(url);
        }
    }
})

.factory('AppSettings', function ($translate, tmhDynamicLocale, $log) {
    var savedData = {
        domainURI: 'http://chineselearn.info/',
        wpjsonURI: 'wp-json/wp/v2/',
        enableFriends: true,
        language: 'en',
        languageURI: ''
    }

    return {
        change: function ($item, value) {
            savedData.$item = value;
            if ($item == 'language') {
                // Set Language URI
                switch(value) {
                    case 'en':
                        savedData.languageURI = '';
                        break;
                    case 'zh':
                        savedData.languageURI = 'zh-hant/';
                        break;
                    default:
                        savedData.languageURI = value + '/';
                } 

                $translate.use(value);
                tmhDynamicLocale.set(value);
            }
            $log.debug($item + ' : ' + value);
        },
        get: function ($item) {
            return savedData.$item;
        },
        getURI: function () {
            return savedData.domainURI + savedData.languageURI + savedData.wpjsonURI;
        }
    };
});