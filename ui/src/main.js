import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import App from './App.vue';
import ProviderListPage from './components/ProviderListPage.vue';
import ProviderEditPage from './components/ProviderEditPage.vue';

import 'vuetify/dist/vuetify.min.css';

import store from './store/store';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/summary', component: ProviderListPage },
    { path: '/edit/:id', component: ProviderEditPage },
    { path: '/*', redirect: '/summary' }
  ]
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');
