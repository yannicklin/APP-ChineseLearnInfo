import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Card, Button, Icon} from 'react-native-elements';
import {i18nT} from '../i18n';

export default function post() {
  return (
    <Card>
      {' '}
      <Card.Title>HELLO WORLD</Card.Title>
      <Card.Divider />
      <Card.Image source={require('../images/pic2.jpg')}>
        <Text style={{marginBottom: 10}}>
          The idea with React Native Elements is more about component structure
          than actual design.
        </Text>
        <Button
          icon={<Icon name="code" color="#ffffff" />}
          buttonStyle={{
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="VIEW NOW"
        />
      </Card.Image>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
