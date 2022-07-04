import * as types from './mutations-types'
import API from '@/api'

export default{
  /**
   * Función para realizar el inicio de sesión de los usuarios
   * Se llama a la función de inicio de sesión de la API que devuelve
   * las credenciales del usuario y, tras comprobar que ha verificado su email
   * se le da acceso y se actualiza el estado del sistema.
   * @param {string} email email del usuario
   * @param {string} password contraseña del usuario 
   * @returns 
   */
  loginUser ({ commit }, { email, password }) {
    return new Promise((resolve, reject)=>{
      commit(types.LOGIN_USER_REQUEST)
      API.login(email, password)
          .then((userCredential) => {
            if (!userCredential.user.emailVerified) {
              API.logOut()
              commit(types.LOGIN_USER_FAILURE, { error: 'No ha verificado su cuenta' })
              reject();
            } else {
              API.getUserData()
                  .then((credentials) => {
                    commit(types.LOGIN_USER_SUCCESS, credentials)
                    resolve()
                  })
            }
          })
          .catch((error) => {
            if (error.code === 'auth/user-not-found') {
              commit(types.LOGIN_USER_FAILURE, { error: 'El email introducido no está registrado' })
              reject()
            } else if (error.code === 'auth/wrong-password') {
              commit(types.LOGIN_USER_FAILURE, { error: 'La contraseña introducida es incorrecta' })
              reject()
            }
          })
    })

  },

  /**
   * Función para realizar el registro de usuarios
   * Se llama a la función de la API para realizar el registro del usuario
   * en el sistema tras comprobar que las dos contraseñas introducidas son iguales.
   * @param {string} email email del usuario
   * @param {string} password contraseña del usuario 
   * @param {string} name nombre del usuario
   * @param {string} surname apellidos del usuario
   * @param {string} password2 contraseña del usuario repetida (seguridad)
   * @param {File} profilePhoto archivo jpg con la foto del usuario (si ha rellenado el campo)
   */
  registerUser ({ commit }, { email, password, name, surname, password2, profilePhoto }) {
    return new Promise((resolve) => {
      commit(types.REGISTER_USER_REQUEST)
      if (password !== password2) {
        commit(types.REGISTER_USER_FAILURE, { error: 'Las contraseñas no coinciden' })
      } else {
        API.register(email, password, name, surname, profilePhoto)
          .then(() => {
            commit(types.REGISTER_USER_SUCCESS)
            resolve()
          })
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
    })
  },

  /**
   * Función que recupera toda la información del usuario a partir de su UID.
   * El estado se actualiza con esta información
   * @param {string} id UID del usuario
   */
  getUserById ({commit}, id) {
    return new Promise((resolve) => {
      API.getUserDataById(id)
        .then((user)=>{
          commit(types.GET_OTHERUSER_SUCCESS, user)
          resolve()
        })
        .catch((error) =>{
          commit(types.GET_OTHERUSER_FAILURE, error)
        })
    })
  },

  /**
   * Función para restablecer la contraseña del usuario.
   * Se llama a la función de la API para que envíe un email de restablecimiento
   * de contraseña al usuario.
   * @param {string} email email del usuario
   */
  resetPassword ({ commit }, email) {
    commit(types.RESET_PASSWORD_REQUEST)
    API.resetPass(email)
      .then(() => commit(types.RESET_PASSWORD_SUCCESS))
      .catch(error => commit(types.RESET_PASSWORD_FAILURE, { error }))
  },

  /**
   * Función para cambiar la contraseña del usuario.
   * Se actualiza la contraseña del usuario llamando a la función 
   * correspondiente de la API.
   * Se comprueba que el usuario ha introducido correctamente su contraseña actual
   * realizando de nuevo el login y si es correcta se cambia por la nueva.
   * @param {string} email email del usuario
   * @param {string} currentPassword contraseña actual del usuario
   * @param {string} newPassword nueva contraseña del usuario
   * @param {string} repeatedPassword repetición de la nueva contraseña
   */
  changePassword ({commit}, {email, currentPassword, newPassword, repeatedPassword}) {
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

  /**
   * Función para cambiar la información personal del usuario, a excepción de la contraseña.
   * Se llama a la función de la API correspondiente
   * @param {string} displayName nuevo nombre del usuario (si cambiara)
   * @param {string} descripcion descripcion del usuario
   * @param {File} profilePhoto nueva foto de perfil del usuario (si cambiara)
   */
  changeInfo ({commit}, {displayName, profilePhoto, descripcion}) {
    API.changeUserInfo(displayName, profilePhoto, descripcion)
      .then((user) => {
        commit(types.CHANGE_INFO_SUCCESS, {user: user, descripcion: descripcion})
      })
      .catch((error) => {
        commit(types.CHANGE_INFO_FAILURE, { error: error })})
  },

  /**
   * Función para el borrado de cuenta
   * Se comprueban las credenciales del usuario para asegurar que realmente
   * desea eliminar su cuenta. Después se borran todos los elementos de la base
   * de datos del usuario y se elimina la cuenta del usuario.
   * @param {array} images imagenes subidas por el usuario 
   * @param {string} email email del usuario
   * @param {string} password contraseña del usuario 
   */
  deleteAccount ({commit}, {images, email, password}) {
    return new Promise((resolve) => {
      API.login(email, password)
      .then(async () => {
        for (const element of images) {
          await API.removePostById(element.id, element.esPublico)
            .catch((error) => { commit(types.DELETE_ACCOUNT_FAILURE, {error: error}) })
        }
        API.deleteUserAccount()
          .then(() => {
            commit(types.DELETE_ACCOUNT_SUCCESS)
            resolve()
          })
          .catch((error) => { commit(types.DELETE_ACCOUNT_FAILURE, {error: error}) })
      })
      .catch(() => commit(types.DELETE_ACCOUNT_FAILURE, { error: 'Credenciales introducidas incorrectas' }))
    })
  },

  /**
   * Función para empezar a seguir a un usuario.
   * Se llama a la función de la API para actualizar la base de datos
   * con el email del nuevo usuario que seguimos
   * @param {string} email email del usuario a seguir
   */
  followUser ({commit}, email) {
    API.followByEmail(email)
      .then(() => {
        commit(types.FOLLOW_USER_SUCCESS, email)
      })
      .catch((error) => {
        commit(types.FOLLOW_USER_FAILURE, error)
      })
  },

  /**
   * Función para empezar a seguir a un usuario.
   * Se llama a la función de la API para actualizar la base de datos
   * eliminando el email del usuario que dejamos de seguir
   * @param {string} email email del usuario que dejamos de seguir
   */
  stopFollow ({commit}, email) {
    API.stopFollowByEmail(email)
      .then(() => {
        commit(types.STOP_FOLLOW_SUCCESS, email)
      })
      .catch((error) => {
        commit(types.STOP_FOLLOW_FAILURE, error)
      })
  },

  /**
   * Función que recupera las 20 imágenes más recientes del usuario
   * empezando por la imagen con id 'start'
   * Si start está vacío se empieza desde el principio
   * @param {string} id id del usuario
   * @param {start} id de la imagen por la que queremos empezar
   */
   getImagesUser ({ commit }, {id, start}) {
    commit(types.FETCH_IMAGES_REQUEST, start)
    API.getMyImages(id, start)
      .then((images) => {
        commit(types.FETCH_IMAGES_SUCCESS, images)
      })
      .catch ((error) => {
        commit(types.FETCH_IMAGES_FAILURE, error)
      })
  },

  /**
   * Función que recupera los 20 reportes más recientes del sistema
   * empezando por la imagen con id 'start'
   * Si start está vacío se empieza desde el principio
   * @param {start} id de la imagen reportada por la que queremos empezar
   */
   getReportes ({ commit }, start) {
    commit(types.FETCH_IMAGES_REQUEST, start)
    API.getReportss(start)
      .then((images) => {
        commit(types.FETCH_IMAGES_SUCCESS, images)
      })
      .catch ((error) => {
        commit(types.FETCH_IMAGES_FAILURE, error)
      })
  },

  /**
   * Función que recupera las 20 publicaciones más recientes del sistema
   * empezando por la imagen con id 'start'
   * Si start está vacío se empieza desde el principio
   * @param {start} id de la publicación por la que queremos empezar
   */
   getPosts ({ commit }, start) {
    commit(types.FETCH_IMAGES_REQUEST, start)
    API.getPostss(start)
      .then((images) => {
        commit(types.FETCH_IMAGES_SUCCESS, images)
      })
      .catch ((error) => {
        commit(types.FETCH_IMAGES_FAILURE, error)
      })
  },

  /**
   * Función que recupera las 5 publicaciones más recientes del sistema,
   * que funcionan como demo para un usuario no registrado
   */
   getDemo ({ commit }) {
    commit(types.FETCH_IMAGES_REQUEST, '')
    API.getPostsDemo()
      .then((images) => {
        commit(types.FETCH_IMAGES_SUCCESS, images)
      })
      .catch ((error) => {
        commit(types.FETCH_IMAGES_FAILURE, error)
      })
  },

  /**
   * Función que recupera los 10 comentarios de la publicación 'id'
   * empezando por el comentario con id 'start'
   * Si start está vacío se empieza desde el principio
   * @param {string} id id de la imagen
   * @param {start} id del comentario por el que queremos empezar
   */
  async getImageComments ({ commit }, {id, start}) {
    commit(types.FETCH_COMMENTS_REQUEST, start)
    var comments = await API.getCommentsById(id, start)
    commit(types.FETCH_COMMENTS_SUCCESS, comments)
  },

  /**
   * Función para añadir un comentario a una imagen.
   * Se llama a la función de la API para añadirlo a la base de datos
   * y se actualiza el estado
   * @param {String} idImage id de la imagen a la que comentamo
   * @param {String} comment texto del comentario a añadir
   */
  async addComment ({commit}, {idImage, comment}) {
    var res = await API.uploadComment(idImage, comment)
    if (res.code === undefined) {
      commit(types.ADD_COMMENT_SUCCESS, res)
    } else {
      commit(types.ADD_COMMENT_FAILURE, res)
    }
  },

  /**
   * Función utilizada para añadir una imagen al sistema junto a su descripcion
   * Se llama a la función correspondiente de la API para añadir la imagen
   * a la base de datos
   * @param {File} file archivo correspondiente a la imagen que añadimos
   * @param {String} descripcion descripcion de la imagen
   */
  async addPhotoFile ({commit}, {file, descripcion}) {
    API.uploadPhoto(file, descripcion)
      .then((res) => {
        commit(types.ADD_PHOTO_SUCCESS, res)
      })
      .catch((error) => {
        commit(types.ADD_PHOTO_FAILURE, error)
      })
  },

  /**
   * Función que elimina una publicación completa, verificando si tiene paisaje sonoro
   * generado o no y eliminándolo también si fuera necesario.
   * Se llama a la función de la API correspondiente para eliminarlo de la base
   * de datos.
   * @param {string} id id de la publicación que hay que borrar
   * @param {boolean} esPublico indica si la publicación es pública
   * o no (si posee paisaje sonoro)
   */
  async removePost ({commit}, {id, esPublico}) {
    return new Promise((resolve, reject) => {
      API.removePostById(id, esPublico)
      .then(() => {
        commit(types.REMOVE_POST_SUCCESS, id)
        resolve()
      })
      .catch((error) => {
        commit(types.REMOVE_POST_FAILURE, error)
        reject()
      })
    })
  },

  /**
   * Función que elimina del sistema el paisaje sonoro generado de una imagen.
   * Se llama a la función de la API correspondiente.
   * @param {string} id id de la publicación de la que hay que borrar el soundscape
   */
  async removeSoundscape ({commit}, id) {
    API.removeSoundscapeId(id)
      .then(() => {
        commit(types.REMOVE_SOUND_SUCCESS, id)
      })
      .catch((error) => {
        commit(types.REMOVE_SOUND_FAILURE, error)
      })
  },

  /**
   * Función utilizada para borrar un comentario de una imagen.
   * Se llama a la función de la API correspondiente.
   * @param {string} idImage id de la imagen de la que hay que borrar el comentario
   * @param {string} id id del comentario
   */
  async removeComment ({commit}, {idImage, id}) {
    API.removeCommentId(idImage, id)
      .then(() => {
        commit(types.REMOVE_COMMENT_SUCCESS, id)
      })
      .cathc((error) => {
        commit(types.REMOVE_COMMENT_FAILURE, error)
      })
  },

  /**
   * Función utilizada para la petición al servidor donde se encuentra el script de generación
   * de paisajes sonoros y reconocimiento de imágenes.
   * Una vez recibida respuesta se llama a la función de la API correspondiente para el amacenamiento
   * del audio generado.
   * @param {string} url URL donde se encuentra la imagen a partir de la que hay
   * que generar el paisaje sonoro
   * @param {id} id id de la imagen de la que hay que generar el paisaje.
   */
  generateSoundscape ({commit}, {url, id}) {
    commit(types.GEN_SOUNDSCAPE_REQUEST)
    var xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    var params = url
    xhr.open('POST', 'http://65.108.220.52', true)

    xhr.onload = function () {
      if (xhr.status === 200) {
        var byteArray = xhr.response
        API.uploadSoundscape(byteArray, id)
          .then((url) => { commit(types.GEN_SOUNDSCAPE_SUCCESS, {url: url, id: id}) })
          .catch((res) => { commit(types.GEN_SOUNDSCAPE_FAILURE, res) })
      } else if (xhr.status === 209) {
        commit(types.GEN_SOUNDSCAPE_FAILURE, {error: 'No se han reconocido objetos en la imagen. Inténtelo de nuevo.'})
      } else {

        commit(types.GEN_SOUNDSCAPE_FAILURE, {error: ' ' + xhr.status + 'Fallo en la petición HTTP'})
      }
    }
    xhr.send(params)
  },

  /**
   * Función utilizada cuando un usuario da me gusta a una publicación.
   * Se llama a la función de la API correspondiente para almacenar el nuevo like.
   * @param {string} id id de la imagen a la que dar Me gusta
   * @param {id} email email del usuario que ha dado Me gusta
   */
  async giveLike ({commit}, {id, email}) {
    API.givePostLike(id, email)
      .then((likes) => {
        commit(types.GIVE_LIKE_SUCCESS, {id, likes})
      })
      .catch((error) => {
        commit(types.GIVE_LIKE_FAILURE, error)
      })
  },

  /**
   * Función utilizada cuando un usuario quita un me gusta a una publicación.
   * Se llama a la función de la API correspondiente para eliminar el like.
   * @param {string} id id de la imagen a la que quitar el Me gusta
   * @param {id} email email del usuario que quiere quitar el Me gusta
   */
  async removeLike ({commit}, {id, email}) {
    API.removePostLike(id, email)
    .then((likes) => {
      commit(types.REMOVE_LIKE_SUCCESS, {id, likes})
    })
    .catch((error) => {
      commit(types.REMOVE_LIKE_FAILURE, error)
    })
  },

  /**
   * Función utilizada para editar la descripcion de una publicación.
   * Se llama a la función de la API correspondiente para actualizar la descripción de
   * la publicación
   * @param {string} id id de la publicacion a la que editar la descripcion
   * @param {string} descripcion descripcion de la publicación
   */
  editDescription ({commit}, {id, descripcion}) {
    API.editDescriptionById(id, descripcion)
      .then(() => {
        commit(types.EDIT_DESCRIPTION_SUCCESS, {id: id, descripcion: descripcion})
      })
      .catch((error) => {
        commit(types.EDIT_DESCRIPTION_FAILURE, error)
      })
  },

  /**
   * Función utilizada para realizar un reporte de una publicación.
   * Se llama a la función de la API correspondiente para almacenar el nuevo
   * reporte
   * @param {string} id id de la publicación que se desea reportar
   * @param {string} descripcion descripción del reporte
   */
  async reportPost ({commit}, {id, descripcion}) {
    API.reportPostById(id, descripcion)
      .then((res) => {
        commit(types.REPORT_POST_SUCCESS, {id: id, report: res})
      })
      .catch((error) => {
        commit(types.REPORT_POST_FAILURE, error)
      })
  },

  /**
   * Función utilizada para confirmar el reporte de una publicación.
   * Se llama a la función de la API correspondiente para eliminar la publicación
   * reportada
   * @param {string} id id de la publicación
   */
  confirmReport ({commit}, id) {
    return new Promise((resolve) =>{
      API.removePostById(id, true)
        .then(() => {
          commit(types.CONFIRM_REPORT_SUCCESS)
          resolve()
        })
        .catch((error) => {
          commit(types.CONFIRM_REPORT_FAILURE, error)
        })
    })
  },

  /**
   * Función utilizada para rechazar el reporte de una publicación.
   * Se llama a la función de la API correspondiente para eliminar los
   * reportes de la publicación
   * @param {string} id id de la publicación
   */
  async declineReport ({commit}, id) {
    API.declineReportId(id)
      .then(() => {
        commit(types.DECLINE_REPORT_SUCCESS, id)
      })
      .catch((error) => {
        commit(types.DECLINE_REPORT_FAILURE, error)
      })
  },

  /**
   * Función utilizada para el cierre de sesión del usuario
   * Se llama a la función de la API correspondiente.
   */
  signOut ({commit}) {
    return new Promise((resolve, reject) => {
      API.logOut()
          .then(() => {
            commit(types.LOG_OUT_SUCCESS)
            resolve()
          })
          .catch((error) => {
            commit(types.LOG_OUT_FAILURE, {error})
            reject(error)
          })
    })

  }
}
