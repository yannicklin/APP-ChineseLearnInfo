angular.module('starter.services', [])

.factory('DataLoader', function ($http) {
    var $domainURI = 'http://chineselearn.info/';
    return {
        get: function ($lang, $term) {
            var $url = $domainURI + $lang + 'wp-json/wp/v2/' + $term;
            return $http.get($url);
        }
    }
});