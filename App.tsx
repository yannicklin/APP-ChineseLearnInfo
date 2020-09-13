import 'react-native-gesture-handler';
import React from 'react';
import {I18nManager, StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import memoize from 'lodash.memoize';

import {NavigationContainer} from '@react-navigation/native';
import Tabs from './tabs/tabDash';

const translationGetters = {
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

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = {languageTag: 'en', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig();
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <ThemeProvider>
            <Tabs />
          </ThemeProvider>
        </NavigationContainer>
      </>
    );
  }
}

export default App;
