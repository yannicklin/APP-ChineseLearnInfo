import React from 'react';
import {Text, View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Header, Card} from 'react-native-elements';
import {i18nT} from '../i18n';

export default function TabTags() {
  return (
    <SafeAreaView>
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{
          text: i18nT('TAB_TITLE_TAGS'),
          style: {color: '#fff'},
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      <Text>Tags</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
