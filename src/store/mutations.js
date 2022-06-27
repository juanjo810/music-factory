import Vue from 'vue'
import * as types from './mutations-types'
// import Vue from 'vue'

export default{
  [types.LOGIN_USER_REQUEST] (state) {
    state.fetchingUser = true
    state.error = ''
  },

  [types.LOGIN_USER_SUCCESS] (state, {displayName, email}) {
    state.fetchingUser = false
    state.error = ''
    if (email === 'jjnc08102000@gmail.com') {
      state.user.data = {displayName, email, esAdmin: true}
    } else {
      state.user.data = {displayName, email, esAdmin: false}
    }
    state.user.loggedIn = true
  },

  [types.LOGIN_USER_FAILURE] (state, { error }) {
    state.fetchingUser = false
    state.error = error
  },

  [types.GET_USER] (state, {displayName, email}) {
    state.user.data = {displayName, email}
    state.user.loggedIn = true
  },

  [types.REPORT_POST] (state, {id, report}) {
    state.images.find(image => {
      if (image.id === id) {
        image.reporte = report
        image.esReportado = true
      }
    })
  },

  [types.DECLINE_REPORT] (state, id) {
    state.images.find(image => {
      if (image.id === id) {
        image.reporte = []
        image.esReportado = false
      }
    })
  },

  [types.GIVE_LIKE] (state, {id, likes}) {
    state.images.find(image => {
      if (image.id === id) {
        image.likes = likes
        image.numLikes++
      }
    })
  },

  [types.REMOVE_LIKE] (state, {id, likes}) {
    state.images.find(image => {
      if (image.id === id) {
        image.likes = likes
        image.numLikes--
      }
    })
  },

  [types.REMOVE_SOUND] (state, id) {
    state.images.find(image => {
      if (image.id === id) {
        image.esPublico = false
        image.soundscape = ''
      }
    })
  },

  [types.CONFIRM_REPORT] (state, id) {
    state.images = state.images.filter(image => image.id !== id)
  },

  [types.REGISTER_USER_REQUEST] (state) {
    state.fetchingUser = true
    state.error = ''
  },

  [types.REGISTER_USER_SUCCESS] (state) {
    state.fetchingUser = false
    state.error = ''
  },

  [types.REGISTER_USER_FAILURE] (state, { error }) {
    state.fetchingUser = false
    state.error = error
  },

  [types.RESET_PASSWORD_REQUEST] (state) {
    state.error = ''
    state.changingPass = true
  },

  [types.RESET_PASSWORD_SUCCESS] (state) {
    state.error = ''
    state.changingPass = false
  },

  [types.RESET_PASSWORD_FAILURE] (state, { error }) {
    state.error = error
    state.changingPass = false
  },

  [types.CHANGE_PASSWORD_REQUEST] (state) {
    state.changingPass = true
    state.error = ''
  },

  [types.CHANGE_PASSWORD_SUCCESS] (state) {
    state.changingPass = false
    state.error = ''
  },

  [types.CHANGE_PASSWORD_FAILURE] (state, { error }) {
    state.changingPass = false
    state.error = error
  },

  [types.CHANGE_INFO_REQUEST] (state) {
    state.changingPass = true
    state.error = ''
  },

  [types.CHANGE_INFO_SUCCESS] (state) {
    state.changingPass = false
    state.error = ''
  },

  [types.CHANGE_INFO_FAILURE] (state, { error }) {
    state.changingPass = false
    state.error = error
  },

  [types.LOG_OUT_REQUEST] (state) {
    state.error = ''
  },

  [types.LOG_OUT_FAILURE] (state, {error}) {
    state.error = error
  },

  [types.LOG_OUT_SUCCESS] (state) {
    state.user.loggedIn = false
    state.user.data = null
    state.images = []
  },

  [types.DELETE_ACCOUNT_REQUEST] (state) {
    state.error = ''
  },

  [types.DELETE_ACCOUNT_FAILURE] (state, {error}) {
    state.error = error
  },

  [types.DELETE_ACCOUNT_SUCCESS] (state) {
    state.user.loggedIn = false
    state.user.data = null
    state.images = []
  },

  [types.FETCH_IMAGES_REQUEST] (state) {
    state.error = ''
    state.fetchingImages = true
  },

  [types.FETCH_IMAGES_SUCCESS] (state, images) {
    state.fetchingImages = false
    state.error = ''
    state.images = images
  },

  [types.FETCH_IMAGES_FAILURE] (state, { error }) {
    state.error = error
    state.fetchingImages = false
  },

  [types.ADD_PHOTO_REQUEST] (state) {
    state.error = ''
  },

  [types.ADD_PHOTO_SUCCESS] (state, img) {
    state.images.push(img)
    Vue.set(state.images, state.images.lenght - 1, img)
  },

  [types.REMOVE_POST_SUCCESS] (state, id) {
    state.fetchingImages = false
    state.error = ''
    var element = state.images.find(image => image.id === id)
    var index = state.images.indexOf(element)
    state.images.splice(index, 1)
  },

  [types.GEN_SOUNDSCAPE_REQUEST] (state) {
    state.generatingSoundscape = true
    state.error = ''
  },

  [types.GEN_SOUNDSCAPE_SUCCESS] (state, {url, id}) {
    state.generatingSoundscape = false
    state.error = ''
    var element = state.images.find(image => image.id === id)
    element.esPublico = true
    element.soundscape = url
  },

  [types.GEN_SOUNDSCAPE_FAILURE] (state, {error}) {
    state.generatingSoundscape = false
    state.error = error
  }
}
