/**
 * @module Store
 * 
 * @description En este fichero se realiza la definición de la Store del sistema
 */

import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const debug = process.env.NODE_ENV !== 'production'
const dataState = createPersistedState({
  reducer: (state) => ({
    user: state.user,
    fetchingUser: state.fetchingUser,
    fetchingImages: state.fetchingImages,
    changingPass: state.changingPass,
    generatingSoundscape: state.generatingSoundscape,
    images: state.images,
    noComments: state.noComments,
    comments: state.comments
  })
})

const store = createStore({
    strict: debug,
    plugins: debug ? [createLogger(), dataState] : [dataState],
    state,
    getters,
    actions,
    mutations
})


export default store
