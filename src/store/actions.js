import * as types from './mutations-types'
import API from '@/api'

export default{
  // Fetch user
  async loginUser ({ commit }, { email, password }) {
    commit(types.LOGIN_USER_REQUEST)
    await API.login(email, password)
      .then((userCredential) => {
        if (!userCredential.user.emailVerified) {
          API.logOut()
          commit(types.LOGIN_USER_FAILURE, { error: 'No ha verificado su cuenta' })
        } else {
          commit(types.LOGIN_USER_SUCCESS, userCredential.user)
          API.getImagesByUser(userCredential.user.email)
        }
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          commit(types.LOGIN_USER_FAILURE, { error: 'El email introducido no está registrado' })
        } else if (error.code === 'auth/wrong-password') {
          commit(types.LOGIN_USER_FAILURE, { error: 'La contraseña introducida es incorrecta' })
        }
      })
  },

  // Fetch user
  registerUser ({ commit }, { email, password, name, surname, password2 }) {
    commit(types.REGISTER_USER_REQUEST)
    if (password !== password2) {
      console.log(password)
      console.log(password2)
      commit(types.REGISTER_USER_FAILURE, { error: 'Las contraseñas no coinciden' })
    } else {
      API.register(email, password, name, surname)
        .then(() => commit(types.REGISTER_USER_SUCCESS))
        .catch(error => {
          if (error.code === 'auth/weak-password') {
            commit(types.REGISTER_USER_FAILURE, { error: 'La contraseña debe contener 6 caracteres o más' })
          } else if (error.code === 'auth/email-already-in-use') {
            commit(types.REGISTER_USER_FAILURE, { error: 'El email introducido ya está en uso' })
          } else {
            commit(types.REGISTER_USER_FAILURE, { error })
          }
        })
    }
  },

  resetPassword ({ commit }, email) {
    commit(types.RESET_PASSWORD_REQUEST)
    API.resetPass(email)
      .then(() => commit(types.RESET_PASSWORD_SUCCESS))
      .catch(error => commit(types.RESET_PASSWORD_FAILURE, { error }))
  },

  changePassword ({commit}, {email, currentPassword, newPassword, repeatedPassword}) {
    commit(types.CHANGE_PASSWORD_REQUEST)
    if (newPassword !== repeatedPassword) {
      commit(types.CHANGE_PASSWORD_FAILURE, { error: 'Las contraseñas no coinciden' })
    } else {
      API.login(email, currentPassword)
        .then(() => {
          API.changeUserPassword(newPassword)
            .then(() => {
              commit(types.CHANGE_PASSWORD_SUCCESS)
            })
            .catch(error => {
              if (error.code === 'auth/weak-password') {
                commit(types.CHANGE_PASSWORD_FAILURE, { error: 'La contraseña debe contener 6 caracteres o más' })
              } else {
                commit(types.CHANGE_PASSWORD_FAILURE, { error })
              }
            })
        })
        .catch(() => commit(types.CHANGE_PASSWORD_FAILURE, { error: 'La contraseña actual es incorrecta' }))
    }
  },

  changeInfo ({commit}, {displayName, posts}) {
    commit(types.CHANGE_INFO_REQUEST)
    API.changeUserInfo(displayName, posts)
      .then(() => {
        commit(types.CHANGE_INFO_SUCCESS)
      })
      .catch((error) => commit(types.CHANGE_INFO_FAILURE, { error: error }))
  },

  deleteAccount ({commit}, {images, email, password}) {
    commit(types.DELETE_ACCOUNT_REQUEST)
    API.login(email, password)
      .then(async () => {
        for (const element of images) {
          await API.removePostById(element.id, element.esPublico)
            .catch((error) => { commit(types.DELETE_ACCOUNT_FAILURE, {error: error}) })
        }
        API.deleteUserAccount()
          .then(() => { commit(types.DELETE_ACCOUNT_SUCCESS) })
          .catch((error) => { commit(types.DELETE_ACCOUNT_FAILURE, {error: error}) })
      })
      .catch(() => commit(types.DELETE_ACCOUNT_FAILURE, { error: 'Credenciales introducidas incorrectas' }))
  },

  getImagesByEmail ({ commit }, email) {
    commit(types.FETCH_IMAGES_REQUEST)
    var images = []
    API.getImagesByUser(email)
      .then(async (res) => {
        for (const item of res.items) {
          await API.getURL(item)
            .then((imgURL) => {
              images.push(imgURL)
            })
            .catch(error => commit(types.FETCH_IMAGES_FAILURE, { error }))
        }
        return images
      })
      .then((res) => {
        commit(types.FETCH_IMAGES_SUCCESS, res)
      })
      .catch(error => commit(types.FETCH_IMAGES_FAILURE, { error }))
  },

  async getImages ({ commit }) {
    commit(types.FETCH_IMAGES_REQUEST)
    var query = await API.getAllImages()
    var images = []
    query.forEach((doc) => {
      var image = {
        id: doc.id,
        ...doc.data()
      }
      images.push(image)
    })
    commit(types.FETCH_IMAGES_SUCCESS, images)
  },

  async addPhotoFile ({commit}, {file, email, displayName}) {
    commit(types.ADD_PHOTO_REQUEST)
    var res = await API.uploadPhoto(file, email, displayName)
    if (res.code === undefined) {
      commit(types.ADD_PHOTO_SUCCESS, res)
    } else {
      commit(types.ADD_PHOTO_FAILURE, res)
    }
  },

  async removePost ({commit}, {id, esPublico}) {
    var res = await API.removePostById(id, esPublico)
    if (res.code === undefined) {
      commit(types.REMOVE_POST_SUCCESS, id)
    }
  },

  async removeSoundscape ({commit}, id) {
    var res = await API.removeSoundscapeId(id)
    if (res === undefined) {
      commit(types.REMOVE_SOUND, id)
    }
  },

  generateSoundscape ({commit}, {url, id}) {
    commit(types.GEN_SOUNDSCAPE_REQUEST)
    var xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    var params = url
    xhr.open('POST', 'https://soundscape-generation.herokuapp.com/', true)

    xhr.onload = function () {
      if (xhr.status === 200) {
        var byteArray = xhr.response
        API.uploadSoundscape(byteArray, id)
          .then((url) => { commit(types.GEN_SOUNDSCAPE_SUCCESS, {url: url, id: id}) })
          .catch((res) => { commit(types.GEN_SOUNDSCAPE_FAILURE, res) })
      } else {
        commit(types.GEN_SOUNDSCAPE_FAILURE, {error: ' ' + xhr.status + 'Fallo en la petición HTTP'})
      }
    }
    xhr.send(params)
  },

  async giveLike ({commit}, {id, email}) {
    var likes = await API.givePostLike(id, email)
    commit(types.GIVE_LIKE, {id, likes})
  },

  async removeLike ({commit}, {id, email}) {
    var likes = await API.removePostLike(id, email)
    commit(types.REMOVE_LIKE, {id, likes})
  },

  downloadAudio (url) {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'arraybuffer'
    xhr.onload = () => {
      const arraybuffer = xhr.response
      console.log(arraybuffer)
    }
    xhr.open('GET', url)
    xhr.send()
  },

  async reportPost ({commit}, {id, descripcion}) {
    var res = await API.reportPostById(id, descripcion)
    commit(types.REPORT_POST, {id: id, report: res})
  },

  async confirmReport ({commit}, id) {
    await API.removePostById(id, true)
    commit(types.CONFIRM_REPORT)
  },

  async declineReport ({commit}, id) {
    await API.declineReportId(id)
    commit(types.DECLINE_REPORT, id)
  },

  signOut ({commit}) {
    commit(types.LOG_OUT_REQUEST)
    API.logOut()
      .then(() => { commit(types.LOG_OUT_SUCCESS) })
      .catch((error) => { commit(types.LOG_OUT_FAILURE, {error}) })
  }
}
