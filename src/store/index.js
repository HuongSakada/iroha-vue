import Vue from 'vue';
import Vuex from 'vuex';
import Account from './modules/Account';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Account
    }
})