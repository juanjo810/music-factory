import Vue from 'vue'
/* eslint-disable-next-line */
import Vuex from 'vuex'
/* eslint-disable-next-line */
import { createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

/* eslint-disable */
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const dataState = createPersistedState({})

export default new Vuex.Store({
    strict: debug,
    plugins: debug ? [createLogger(), dataState] : [dataState],
    state,
    getters,
    actions,
    mutations
})
