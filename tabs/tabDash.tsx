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
          text: i18nT('DASH_NEWS_TITLE_20170816'),
          style: {color: '#fff'},
        }}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Card>
          <Card.Title>{i18nT('DASH_NEWS_TITLE_20170816')}</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>
            {i18nT('DASH_NEWS_CONTENT_20170816')}
          </Text>
        </Card>

        <Card>
          <Card.Title>{i18nT('DASH_NEWS_TITLE_20170718')}</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>
            {i18nT('DASH_NEWS_CONTENT_20170718')}
          </Text>
        </Card>

        <Card>
          <Card.Title>{i18nT('DASH_NEWS_TITLE_20160304')}</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>
            {i18nT('DASH_NEWS_CONTENT_20160304')}
          </Text>
        </Card>

        <Card>
          <Card.Title>{i18nT('DASH_NEWS_TITLE_20160229')}</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>
            {i18nT('DASH_NEWS_CONTENT_201602229')}
          </Text>
        </Card>

        <Card>
          <Card.Title>{i18nT('DASH_NEWS_TITLE_20160228')}</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>
            {i18nT('DASH_NEWS_CONTENT_20160228')}
          </Text>
        </Card>

        <Card>
          <Card.Title>{i18nT('DASH_NEWS_TITLE_20160227')}</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>
            {i18nT('DASH_NEWS_CONTENT_20160227')}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
