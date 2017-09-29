// Import Vue
import Vue from 'vue';

// Import F7
import Framework7 from 'framework7';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue';

// Import Vue Cordova
import VueCordova from 'vue-cordova';

// Import all i18n jsons
import i18n from './assets/i18n';

// Import axios
import axios from 'axios';

// Import Floating Label
import VueFloatLabel from 'vue-float-label';

// Import Validation for inputs
import VeeValidate, { Validator } from 'vee-validate';
import veevalidateDE from 'vee-validate/dist/locale/de';
import veevalidateEN from 'vee-validate/dist/locale/en';
import veevalidateES from 'vee-validate/dist/locale/es';
import veevalidateFR from 'vee-validate/dist/locale/fr';
import veevalidateJA from 'vee-validate/dist/locale/ja';
import veevalidatePT from 'vee-validate/dist/locale/pt_BR';
import veevalidateRU from 'vee-validate/dist/locale/ru';
import veevalidateZH from 'vee-validate/dist/locale/zh_TW';

// Import Moment (Date Time Display)
import moment from 'moment';

// Import Google Analytics
import VueAnalytics from 'vue-ua';


// Import F7 iOS Theme Styles
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
//import Framework7Theme from 'framework7/dist/css/framework7.material.min.css';
//import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css';

// Import App Custom Styles
import AppStyles from './assets/sass/main.scss';

// Import Icon Styles
//import './assets/css/framework7-icons.css';
import './assets/css/font-awesome.min.css';


// Import Routes
import Routes from './routes.js';

// Import App Component
import App from './app.vue';

// Init F7 Vue Plugin
Vue.use(Framework7Vue);

// Init Vue-Cordova Plugin
Vue.use(VueCordova);

// Init Vue Floating Label Plugin
Vue.use(VueFloatLabel);

// Init Validation Plugin
Validator.addLocale(veevalidateDE);
Validator.addLocale(veevalidateEN);
Validator.addLocale(veevalidateES);
Validator.addLocale(veevalidateFR);
Validator.addLocale(veevalidateJA);
Validator.addLocale(veevalidatePT);
Validator.addLocale(veevalidateRU);
Validator.addLocale(veevalidateZH);
Vue.use(VeeValidate, {
  locale: 'en',
  events: ''
});

// Init Google Analytics
Vue.use(VueAnalytics, {
  appName: 'ChineseLearn InfoCentre APP',
  appVersion: '2.1.2',
  trackingId: 'UA-46856632-5'
})

// Make $http directly goes to axios
Vue.prototype.$http = axios;


// Custom Filters
/**
 * Vue filter to convert a slug to a more human friendly form.
 * @param {String} value The value string.
 */
Vue.filter('humanable', function(value) {
  var words = value.split(/[-_]+/g);
  var results = [];
  for(var i=0; i < words.length; i++) {
    var letter = words[i].charAt(0).toUpperCase();
    results.push(letter + words[i].slice(1));
  }
  return results.join(' ');
});
/**
 * Vue filter to round the decimal to the given place.
 * http://jsfiddle.net/bryan_k/3ova17y9/
 * @param {String} value    The value string.
 * @param {Number} decimals The number of decimal places.
 */
Vue.filter('round', function(value, decimals) {
  if(!value) {
    value = 0;
  }
  if(!decimals) {
    decimals = 0;
  }
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return value;
});
/**
 * Vue filter to truncate a string to the specified length.
 * @param {String} value The value string.
 */
Vue.filter('truncate', function(value, length) {
  if(value.length < length) {
    return value;
  }
  length = length - 4;
  return value.substring(0, length) + ' ...';
});


// Init App
var vueAPP = new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    material: true,
    routes: Routes
  },
  // Init data as config
  data: {
    axiosWP:{
      baseURL: 'https://chineselearn.info/',
      timeout: 100000,
      headers:{
      }
    },
    axiosMAIL:{
      baseURL: 'https://api.elasticemail.com/v2/email/send',
      timeout: 100000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      transformRequest: function (obj) {
        var str = [];
        for (var p in obj) {
          if (obj[p].length > 0) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
        }
        return str.join('&');
      }
    },
    wpURLrest : 'wp-json/wp/v2/'
  },
  // Register App Component
  components: {
    app: App
  },
  methods:{
    removeDOMElement(origin, tag) {
      var htmlObject = document.createElement('div');
      htmlObject.innerHTML = origin;

      var parts = htmlObject.getElementsByTagName(tag);
      for (var i = parts.length; i > 0 ; i--) {
        parts[i - 1].parentNode.removeChild(parts[i - 1]);
      };

      return htmlObject.outerHTML;
    },
    formatDateTime(origin){
      if (origin) {
        return moment(String(origin)).format('MM/DD/YYYY hh:mm');
      } else {
        //return Now
        return moment().format('MM/DD/YYYY hh:mm');
      }
    }
  },
  mounted: function(){
    // redirect to first tab
    this.$f7.views.main.router.load({url: '/tabs/'});
  },
  i18n,
  render: h => h(App)
});


// Check Device Network Status
Vue.cordova.on('deviceready', () => {
  Vue.cordova.on('offline', () => {
    vueAPP.$f7.alert(vueAPP.$i18n.t('INTERNET_CONNECTION_NONE'), vueAPP.$i18n.t('ALERT_TITLE_APP'));
  });
});
