import Vue from 'vue';
import Vuex from 'vuex';
import * as mutationTypes from './mutation-types';

Vue.use(Vuex);

const state = {
  appBarState: {
    title: '',
    hasParentPage: false
  },
  baseUrl: 'http://localhost:3000'
};

const actions = {
  setAppBarState({ commit }, appBarState) {
    commit(mutationTypes.SET_APPBAR_STATE, appBarState);
  },
  setBaseUrl({ commit }, baseurl) {
    commit(mutationTypes.SET_BASEURL, baseurl);
  }
};

const mutations = {
  [mutationTypes.SET_APPBAR_STATE](state, appBarState) {
    state.appBarState = appBarState;
  },
  [mutationTypes.SET_BASEURL](state, baseurl) {
    state.baseUrl = baseurl;
  }
};

const getters = {
  title: state => state.appBarState.title,
  hasParentPage: state => state.appBarState.hasParentPage,
  baseUrl: state => state.baseUrl
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
