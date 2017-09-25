import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'de': require('./de.json'),
    'en': require('./en.json'),
    'es': require('./es.json'),
    'fr': require('./fr.json'),
    'ja': require('./ja.json'),
    'pt': require('./pt.json'),
    'ru': require('./ru.json'),
    'zh': require('./zh.json')
  }
})

if (module.hot) {
  module.hot.accept(
    [ './de.json',
      './en.json',
      './es.json',
      './fr.json',
      './ja.json',
      './pt.json',
      './ru.json',
      './zh.json',
    ], () => {
    i18n.setLocaleMessage('de', require('./de.json'))
    i18n.setLocaleMessage('en', require('./en.json'))
    i18n.setLocaleMessage('es', require('./es.json'))
    i18n.setLocaleMessage('fr', require('./fr.json'))
    i18n.setLocaleMessage('ja', require('./ja.json'))
    i18n.setLocaleMessage('pt', require('./pt.json'))
    i18n.setLocaleMessage('ru', require('./ru.json'))
    i18n.setLocaleMessage('zh', require('./zh.json'))
    console.log('hot reload', this, arguments)
})
}

export default i18n
