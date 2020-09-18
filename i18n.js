import {I18nManager} from 'react-native';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import memoize from 'lodash.memoize';

export const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  de: () => require('./assets/i18n/de.json'),
  en: () => require('./assets/i18n/en.json'),
  es: () => require('./assets/i18n/es.json'),
  fr: () => require('./assets/i18n/fr.json'),
  ja: () => require('./assets/i18n/ja.json'),
  pt: () => require('./assets/i18n/pt.json'),
  ru: () => require('./assets/i18n/ru.json'),
  zh: () => require('./assets/i18n/zh.json'),
};

export const i18nT = memoize(
  (key, config) =>
    i18n.t(key, config).includes('missing') ? key : i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = () => {
  const fallback = {languageTag: 'en', isRTL: false};
  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  i18nT.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};
