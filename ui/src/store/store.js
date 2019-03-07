import Vue from 'vue';
import Vuex from 'vuex';
import * as mutationTypes from './mutation-types';

Vue.use(Vuex);

const state = {
  appBarState: {
    title: '',
    hasParentPage: false
  },
  baseUrl: process.env.VUE_APP_SERVER_URI,
  user: {
    userId: 'wahhoier'
  }
};

const actions = {
  setAppBarState({ commit }, appBarState) {
    commit(mutationTypes.SET_APPBAR_STATE, appBarState);
  },
  setBaseUrl({ commit }, baseurl) {
    commit(mutationTypes.SET_BASEURL, baseurl);
  },
  setUser({ commit }, user) {
    commit(mutationTypes.SET_USER, user);
  }
};

const mutations = {
  [mutationTypes.SET_APPBAR_STATE](state, appBarState) {
    state.appBarState = appBarState;
  },
  [mutationTypes.SET_BASEURL](state, baseurl) {
    state.baseUrl = baseurl;
  },
  [mutationTypes.SET_USER](state, user) {
    state.user = {
      ...user
    };
  }
};

const getters = {
  title: state => state.appBarState.title,
  hasParentPage: state => state.appBarState.hasParentPage,
  baseUrl: state => state.baseUrl,
  user: state => state.user
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
