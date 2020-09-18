import React from 'react';
import {Icon} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TabDash from './tabDash';
import TabCategories from './tabCategories';
import TabTags from './tabTags';
import TabAreas from './tabAreas';
import TabSettings from './tabSettings';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={TabDash}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon type="ionicon" name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Category"
        component={TabCategories}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon type="ionicon" name="folder-open" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tag"
        component={TabTags}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon type="ionicon" name="pricetags" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Area"
        component={TabAreas}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon type="ionicon" name="earth" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={TabSettings}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon type="ionicon" name="hammer" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
