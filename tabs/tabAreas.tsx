import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Header, Card} from 'react-native-elements';
import {i18nT} from '../i18n';

import Svg, {G, Path, Circle} from 'react-native-svg';
import * as d3 from 'd3';
import {feature} from 'topojson-client';

export default function TabDash() {
  return (
    <SafeAreaView>
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{
          text: i18nT('TAB_TITLE_AREAS'),
          style: {color: '#fff'},
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      <Text>D3 Prepare</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
