import Vue from 'vue';
import Vuex from 'vuex';
import * as mutationTypes from './mutation-types';

Vue.use(Vuex);

const state = {
  title: '',
  baseUrl: 'http://localhost:3000'
};

const actions = {
  setTitle({ commit }, title) {
    commit(mutationTypes.SET_TITLE, title);
  },
  setBaseUrl({ commit }, baseurl) {
    commit(mutationTypes.SET_BASEURL, baseurl);
  }
};

const mutations = {
  [mutationTypes.SET_TITLE](state, title) {
    state.title = title;
  },
  [mutationTypes.SET_BASEURL](state, baseurl) {
    state.baseUrl = baseurl;
  }
};

const getters = {
  title: state => state.title,
  baseUrl: state => state.baseUrl
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
