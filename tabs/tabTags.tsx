import React from 'react';
import {Text, View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Header, Card} from 'react-native-elements';
import * as RNLocalize from 'react-native-localize';

import axios from 'axios';
import Config from 'react-native-config';

class TabTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
    };
    this.queryTags();
  }

  queryTags = () => {
    // this.targetobject = (this.$props.objectType) ? this.$props.objectType : 'posts';
    // var queryURI = (('zh' == this.$i18n.locale)? 'zh-hant/' : '' ) + this.$root.$data.wpURLrest + this.targetobject + '?page=' + this.pageno + '&orderby=name&order=asc&per_page=' + this.recperpage + ((this.$props.queryTerm)? ('&' + this.$props.queryTerm) : '' );
    // this.$ua.trackEvent('Posts', 'List Query', this.targetobject);
    // return queryURI;

    const queryFields = '_fields=author,id,excerpt,title,link';

    const result = axios({
      method: 'get',
      url:
        Config.baseURI +
        ('zh' === RNLocalize.getCountry() ? 'zh-hant/' : '') +
        'aaa/' +
        '?page=' +
        this.pageno +
        '&orderby=name&order=asc&per_page=' +
        this.recperpage +
        (this.$props.queryTerm ? '&' + this.$props.queryTerm : ''),
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      params: {
        ID: 12345,
      },
      responseType: 'json',
    }).then((res) => {
      const records = res.data;
      this.setState({records: records});
      // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
    });
  };

  render() {
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
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});

export default TabTags;
