import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import login from './modules/login';
import ocr from './modules/ocr';
import path from './modules/path';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    login,
    ocr,
    path
  },
  getters
});

export default store;
