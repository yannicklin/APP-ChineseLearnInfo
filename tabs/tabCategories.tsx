import React from 'react';
import {Text, View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Header, Card} from 'react-native-elements';
import {i18nT} from '../i18n';

export default function TabDash() {
  return (
    <SafeAreaView>
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{
          text: i18nT('TAB_TITLE_CATEGORIES'),
          style: {color: '#fff'},
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      <Text>Categories</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
