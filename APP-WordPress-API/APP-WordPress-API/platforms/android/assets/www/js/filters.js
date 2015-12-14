angular.module('chineselearn.filters', [])

.filter('linkremove', function ($sce, $log) {
    return function (text) {
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = text;

        var links = htmlObject.getElementsByTagName('a');
        for (var i = links.length; i > 0 ; i--) {
            links[i-1].parentNode.removeChild(links[i-1]);
        }

        return $sce.trustAsHtml(htmlObject.outerHTML);
    }
})

.filter('unicode', function ($sce) {
    return function (x) {
        return $sce.trustAsHtml(x);
    }
})