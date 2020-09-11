import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Button, ThemeProvider } from 'react-native-elements';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ThemeProvider>
        <Button title="Hey!" />
      </ThemeProvider>
    </>
  );
};

export default App;
