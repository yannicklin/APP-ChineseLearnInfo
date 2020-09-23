import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';

import RNBootSplash from 'react-native-bootsplash';

import * as RNLocalize from 'react-native-localize';
import {setI18nConfig} from './i18n';

import {NavigationContainer} from '@react-navigation/native';
import Tabs from './tabs/tabs';

class App extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig();
  }

  componentDidMount() {
    RNBootSplash.hide({duration: 250});
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
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
