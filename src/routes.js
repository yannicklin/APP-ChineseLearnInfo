export default [
  {
    path: '/rec-list/:objectType/:queryTerm/:displayName',
    component: require('./assets/vue/components/wprec-list.vue')
  },

  {
    path: '/rec-single/:objectId',
    component: require('./assets/vue/components/wprec-single.vue')
  },

  {
    path: '/tabs/',
    tabs: [
      {
        path: '/',
        tabId: 'dash',
        component: require('./assets/vue/pages/dash.vue')
      },
      {
        path: '/tags/',
        tabId: 'tags',
        component: require('./assets/vue/pages/tags.vue')
      },
      {
        path: '/categories/',
        tabId: 'categories',
        component: require('./assets/vue/pages/categories.vue')
      },
      {
        path: '/areas/',
        tabId: 'areas',
        component: require('./assets/vue/pages/areas.vue')
      },
      {
        path: '/settings/',
        tabId: 'settings',
        component: require('./assets/vue/pages/settings.vue')
      }
    ]
  }

]
