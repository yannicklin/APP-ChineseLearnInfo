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

.filter('linkremove_imagelazyload', function ($sce, $log) {
    return function (text) {
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = text;

        // remove links
        var links = htmlObject.getElementsByTagName('a');
        for (var i = links.length; i > 0 ; i--) {
            links[i-1].parentNode.removeChild(links[i-1]);
        }

        // change image attributes
        var imgs = htmlObject.getElementsByTagName('img');
        for (var i = 0 ; i < imgs.length-1 ; i++) {
            imgs[i].setAttribute('image-lazy-src', imgs[i].getAttribute('src'));
            imgs[i].setAttribute('lazy-scroll-resize', true);
            imgs[i].removeAttribute('src');
        }

        return $sce.trustAsHtml(htmlObject.outerHTML);
    }
})

.filter('unicode', function ($sce) {
    return function (x) {
        return $sce.trustAsHtml(x);
    }
})