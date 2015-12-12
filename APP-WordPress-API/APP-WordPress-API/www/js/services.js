angular.module('chineselearn.services', [])

.factory('DataLoader', function ($http, $log) {
    var $domainURI = 'http://chineselearn.info/';
    return {
        get: function ($lang, $term) {
            var $url = $domainURI + $lang + 'wp-json/wp/v2/' + $term;
            $log.debug($url);
            return $http.get($url);
        }
    }
});