angular.module('chineselearn.services', [])

.factory('DataLoader', function ($http, $log, AppSettings) {
    return {
        get: function ($term) {
            var url = AppSettings.getURI() + $term;
            return $http.get(url);
        }
    }
})

.factory('EmailSender', function ($http, $log, AppSettings) {
    return {
        send: function ($mail) {
            $http.post(AppSettings.get('emailAPI'), $mail).
            success(function () {
                $log.debug('successful email send.');
            }).error(function () {
                $log.debug('error sending email.');
            });

            return null;
        }
    }
})

.factory('AppSettings', function ($translate, tmhDynamicLocale, $log) {

    // TODO: get default language in stored or predetermined
    var savedData = {
        domainURI: 'http://chineselearn.info/',
        wpjsonURI: 'wp-json/wp/v2/',
        enableFriends: true,
        language: 'en',
        languageURI: '',
        emailserviceKey: 'e8yCnUcg1OaKz0dWIhIH7w',
        emailAPI: 'https://mandrillapp.com/api/1.0/messages/send.json',
        contactForm2Email: 'support@chineselearn.info',
        contactForm2User: 'Support'
    }

    return {
        change: function ($item, value) {
            savedData[$item] = value;
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
            return savedData[$item];
        },
        getURI: function () {
            return savedData.domainURI + savedData.languageURI + savedData.wpjsonURI;
        }
    };
});