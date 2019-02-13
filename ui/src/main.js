import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import App from './App.vue';
import ProviderListPage from './components/ProviderListPage.vue';
import ProviderPage from './components/ProviderPage.vue';
import ProviderRegisterPage from './components/ProviderRegisterPage.vue';

import 'vuetify/dist/vuetify.min.css';

import store from './store/store';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: ProviderListPage },
    {
      path: '/details/:id',
      component: ProviderPage,
      props: true
    },
    { path: '/register', component: ProviderRegisterPage }
  ]
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');
