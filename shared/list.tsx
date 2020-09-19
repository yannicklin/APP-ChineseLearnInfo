import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import {i18nT} from '../i18n';

export default function list() {
  const list = [];

  return (
    <View>
      {list.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <Icon name={item.icon} />
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
