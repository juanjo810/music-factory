import { auth, storage, firestore } from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail, sendEmailVerification, updatePassword, deleteUser } from 'firebase/auth'
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { collection, getDocs, addDoc, setDoc, Timestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc, query, orderBy, limit, startAfter, where } from 'firebase/firestore'

const imagesRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/userImages')
const soundsRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/soundscapes')
const profileRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/profileImages')
const imagenesStore = collection(firestore, 'imagenes')

export default{
  /**
   * Función para realizar el inicio de sesión en Firebase a partir del
   * email y la contraseña
   * @param {string} email email del usuario
   * @param {string} password contraseña del usuario
   * @returns promesa del inicio de sesión
   */
  login (email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  },

  /**
   * Accede al documento donde están almacenados todos los datos personales 
   * del usuario: email, nombre, uid, foto, descripción y lista de siguiendo.
   * @returns datos de los usuarios
   */
  async getUserData () {
    const user = auth.currentUser
    var docRef = doc(firestore, 'usuarios', user.uid)
    var docSnap = await getDoc(docRef)
    return {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      descripcion: docSnap.data().descripcion,
      siguiendo: docSnap.data().siguiendo
    }
  },

  /**
   * Función utilizada para recuperar los datos personales de otro usuario del sistema
   * @param {string} id uid del usuario
   * @returns Promesa de los datos del usuario
   */
  async getUserDataById (id) {
    return new Promise((resolve,reject) => {
      var docRef = doc(firestore, 'usuarios', id)
        getDoc(docRef)
          .then((docSnap) => {
            resolve({
              id: docSnap.id,
              email: docSnap.data().email,
              displayName: docSnap.data().nombre,
              photoURL: docSnap.data().photoURL,
              descripcion: docSnap.data().descripcion
            })
          })
          .catch((error) => {reject(error)})
      }
    )
  },

  /**
   * Función utilizada para registrar al usuario en Firebase a partir del email y la contraseña.
   * Después se almacenan los datos personales del usuario en la base de datos de Firebase.
   * @param {string} email email del nuevo usuario
   * @param {string} password contraseña del nuevo usuario
   * @param {string} name nombre del nuevo usuario
   * @param {string} surname apellido del nuevo usuario
   * @param {File} profilePhoto foto de perfil del nuevo usuario
   * @returns Promesa del registro del usuario
   */
  register (email, password, name, surname, profilePhoto) {
    return new Promise ( (resolve, reject) => {
      if (profilePhoto !== '') {
        var refImage = ref(profileRef, email + '.jpg')
        uploadBytes(refImage, profilePhoto)
          .then((snapshot) => {
            this.getURL(snapshot.ref)
              .then((url) => {
                resolve(createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    updateProfile(userCredential.user, {
                      displayName: name + ' ' + surname,
                      photoURL: url
                    })
                    var docRef = doc(firestore, 'usuarios', userCredential.user.uid)
                    setDoc(docRef, {
                      descripcion: '',
                      siguiendo: [userCredential.user.email],
                      email: userCredential.user.email,
                      nombre: name + ' ' + surname,
                      photoURL: url
                    })
                    sendEmailVerification(userCredential.user)
                  })
                  .then(() => signOut(auth)))
              })
              .catch(error => { reject(error) })
          })
          .catch(error => { reject(error) })
      } else {
        refImage = ref(profileRef, 'default.jpg')
        this.getURL(refImage)
          .then((url) => {
            resolve(createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                updateProfile(userCredential.user, {
                  displayName: name + ' ' + surname,
                  photoURL: url
                })
                var docRef = doc(firestore, 'usuarios', userCredential.uid)
                setDoc(docRef, {
                  descripcion: '',
                  siguiendo: [userCredential.email],
                  email: userCredential.email,
                  nombre: name + ' ' + surname,
                  photoURL: url
                })
                sendEmailVerification(userCredential.user)
              })
              .then(() => signOut(auth)))
          })
          .catch(error => { reject(error) })
      }
    })
  },

  /**
   * Función que envía un email al usuario para restablecer su contraseña
   * @param {string} email email del usuario
   * @returns promesa del envío del email
   */
  resetPass (email) {
    return sendPasswordResetEmail(auth, email)
  },

  /**
   * Función utilizada para cerrar la sesión del usuario
   * @returns promesa del cierre de sesión
   */
  logOut () {
    return signOut(auth)
  },

  /**
   * Función utilizada para realizar el cambio de contraseña del usuario
   * @param {string} newPassword nueva contraseña del usuario
   * @returns promesa del cambio de contraseña
   */
  changeUserPassword (newPassword) {
    const user = auth.currentUser
    return updatePassword(user, newPassword)
  },

  /**
   * Función utilizada para cambiar los datos personales del usuario (sin incluir
   * la contraseña)
   * @param {string} displayName nombre y apellidos del usuario
   * @param {File} profilePhoto nueva foto de perfil del usuario
   * @param {string} descripcion descripción del usuario
   * @returns promesa del cambio en los datos del usuario
   */
  async changeUserInfo (displayName, profilePhoto, descripcion) {
    const user = auth.currentUser
    var docRef = doc(firestore, 'usuarios', user.uid)
    await updateDoc(docRef, {
      descripcion: descripcion
    })
    var refImage = ''
    if (displayName !== ' ') {
      if (profilePhoto !== '') {
        refImage = ref(profileRef, user.email + '.jpg')
        await uploadBytes(refImage, profilePhoto)
          .then((snapshot) => {
            this.getURL(snapshot.ref)
              .then ((url) => {
                updateDoc(docRef, {
                  nombre: displayName,
                  photoURL: url
                })
                return updateProfile(user, { photoURL: url, displayName: displayName })
              })
          })
      } else {
        updateDoc(docRef, {
          nombre: displayName
        })
        return updateProfile(user, { displayName: displayName })
      }
    }
    if (profilePhoto !== '') {
      refImage = ref(profileRef, user.email + '.jpg')
      await uploadBytes(refImage, profilePhoto)
        .then((snapshot) => {
          this.getURL(snapshot.ref)
            .then ((url) => {
              updateDoc(docRef, {
                photoURL: url
              })
              return updateProfile(user, { photoURL: url })
            })
        })
    }
    return new Promise ((resolve) => {
      resolve()
    })
  },

  /**
   * Función utilizada para realizar el borrado de la cuenta del usuario
   * Se realiza el borrado del documento con los datos del usuario y después de su cuenta 
   * en Firebase.
   * @returns promesa del borrado de cuenta
   */
  deleteUserAccount () {
    return new Promise((resolve, reject) => {
      const user = auth.currentUser
      var docRef = doc(firestore, 'usuarios', user.uid)
      deleteDoc(docRef)
        .then(() => {
          deleteUser(user)
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función utilizada cuando un usuario desee seguir a otro. Se actualiza la lista
   * de siguiendo del usuario añadiendo un nuevo email.
   * @param {string} email email usuario a seguir
   * @returns promesa del seguimiento del usuario
   */
  followByEmail (email) {
    return new Promise((resolve, reject) => {
      const user = auth.currentUser
      var docRef = doc(firestore, 'usuarios', user.uid)
      updateDoc(docRef, {
        siguiendo: arrayUnion(email)
      })
        .then(() => {resolve()})
        .catch((error) => {reject(error)})
    })
  },

  /**
   * Función utilizada cuando un usuario quiera dejar de seguir a otro. Se 
   * elimina el email del usuario de su documento de datos personales.
   * @param {string} email email del usuario que se deja de seguir
   * @returns promesa de dejar de seguir a un usuario
   */
  stopFollowByEmail (email) {
    return new Promise((resolve, reject) => {
      const user = auth.currentUser
      var docRef = doc(firestore, 'usuarios', user.uid)
      updateDoc(docRef, {
        siguiendo: arrayRemove(email)
      })
        .then(() => {resolve()})
        .catch((error) => {reject(error)})
    })
  },

  /**
   * Función que recupera las 20 imágenes más recientes del usuario de la base de datos
   * a partir de una de ellas
   * @param {string} id id del usuario
   * @param {string} start id por el que comenzar la búsqueda
   * @returns promesa de las imágenes encontradas
   */
  async getMyImages (id, start) {
    var userRef = doc(firestore, 'usuarios', id)
    if (start === '') {
      var peticion = query(collection(firestore, "imagenes/"), where("owner", "==", userRef), orderBy("fecha", "desc"), limit(20));
    } else {
      var docRef = doc(firestore, "imagenes/" + start)
      var docStart = await getDoc(docRef)
      peticion = query(collection(firestore, "imagenes/"), where("owner", "==", userRef), orderBy("fecha", "desc"), limit(20), startAfter(docStart));
    }
    return new Promise((resolve, reject) => {
      getDocs(peticion)
        .then(async (documentos) => {
          var images = []
          for (const doc of documentos.docs) {
            var owner = await getDoc(doc.data().owner)
            var image = {
              id: doc.id,
              ...doc.data(),
              owner: [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion, owner.id]
            }
            images.push(image)
          }
          resolve(images)
        })
        .catch((error) => {
          reject(error)
        })
     
    })
  },

  /**
   * Función que recupera los 20 reportes del sistema más recientes a partir
   * del id de uno
   * @param {string} start id por el que comenzar la búsqueda
   * @returns promesa de los reportes encontrados
   */
   async getReportss (start) {
    if (start === '') {
      var peticion = query(collection(firestore, "imagenes/"), where("esReportada", "==", true), orderBy("fecha", "desc"), limit(20));
    } else {
      var docRef = doc(firestore, "imagenes/" + start)
      var docStart = await getDoc(docRef)
      peticion = query(collection(firestore, "imagenes/"), where("esReportada", "==", true), orderBy("fecha", "desc"), limit(20), startAfter(docStart));
    }
    return new Promise((resolve, reject) => {
      getDocs(peticion)
        .then(async (documentos) => {
          var images = []
          for (const doc of documentos.docs) {
            var owner = await getDoc(doc.data().owner)
            var image = {
              id: doc.id,
              ...doc.data(),
              owner: [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion, owner.id]
            }
            images.push(image)
          }
          resolve(images)
        })
        .catch((error) => {
          reject(error)
        })
     
    })
  },


  /**
   * Función que recupera las 20 publicaciones más recientes del sistema a partir del id
   * de una de ellas.
   * @param {string} start id por el que comenzar la búsqueda
   * @returns promesa de las publicaciones encontradas
   */
   async getPostss (start) {
    if (start === '') {
      var peticion = query(collection(firestore, "imagenes/"), where("esPublico", "==", true), orderBy("fecha", "desc"), limit(20));
    } else {
      var docRef = doc(firestore, "imagenes/" + start)
      var docStart = await getDoc(docRef)
      peticion = query(collection(firestore, "imagenes/"), where("esPublico", "==", true), orderBy("fecha", "desc"), limit(20), startAfter(docStart));
    }
    return new Promise((resolve, reject) => {
      getDocs(peticion)
        .then(async (documentos) => {
          var images = []
          for (const doc of documentos.docs) {
            var owner = await getDoc(doc.data().owner)
            var image = {
              id: doc.id,
              ...doc.data(),
              owner: [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion, owner.id]
            }
            images.push(image)
          }
          resolve(images)
        })
        .catch((error) => {
          reject(error)
        })
     
    })
  },

  /**
   * Función que recupera las 5 última publicaciones del sistema
   * @returns promesa de las publicaciones encontradas
   */
  getPostsDemo () {
    return new Promise((resolve, reject) => {
      var peticion = query(collection(firestore, "imagenes/"), where("esPublico", "==", true), orderBy("fecha", "desc"), limit(5));
      getDocs(peticion)
        .then(async (documentos) => {
          var images = []
          for (const doc of documentos.docs) {
            var owner = await getDoc(doc.data().owner)
            var image = {
              id: doc.id,
              ...doc.data(),
              owner: [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion, owner.id]
            }
            images.push(image)
          }
          resolve(images)
        })
        .catch((error) => {
          reject(error)
        })
     
    })
  },

  /**
   * Función que recupera los 10 comentarios de una publicación a partir de
   * la última que se tiene en el estado local.
   * @param {string} id id de la publicación
   * @param {string} start id del último comentario que tenemos
   * @returns lista de comentarios del sistema
   */
  async getCommentsById (id, start) {
    if (start === '') {
      var peticion = query(collection(firestore, "imagenes/" + id + "/comentarios"), orderBy("fecha", "desc"), limit(10));
    } else {
      var docRef = doc(firestore, "imagenes/" + id + "/comentarios/" + start)
      var docStart = await getDoc(docRef)
      peticion = query(collection(firestore, "imagenes/" + id + "/comentarios"), orderBy("fecha", "desc"), startAfter(docStart), limit(10));
    }
    const documentSnapshots = await getDocs(peticion)
    var comments = []
    for (const doc of documentSnapshots.docs) {
      var owner = await getDoc(doc.data().autor)
      if (owner.exists()) {
        var autor = [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion]
      } else {
        autor = ['', 'usuario' + doc.id, 'https://firebasestorage.googleapis.com/v0/b/musicfactory-4cc4a.appspot.com/o/profileImages%2Fdefault.jpg?alt=media&token=2b4bd686-4fb5-44df-a30c-5b809cfce3ca', '']
      }
      var date = new Date (doc.data().fecha * 1000)
      var comment = {
        id: doc.id,
        comentario:doc.data().comentario,
        fecha: date.toUTCString(),
        autor: autor
      }
      comments.push(comment)
    }
    return comments
  },

  /**
   * Función utilizada para recuperar la URL donde se encuentra la imagen solicitada
   * @param {Reference} imagen referencia a la ruta de una imagen de Firebase
   * @returns promesa de la URL de la imagen
   */
  getURL (imagen) {
    return getDownloadURL(imagen)
  },

  /**
   * Función que almacena el paisaje sonoro generado por una imagen en la 
   * base de datos de Firebase
   * @param {File} file archivo de audio del paisaje
   * @param {string} id id de la publicación correspondiente al audio
   * @returns promesa de la URL del audio
   */
   uploadSoundscape (file, id) {
    return new Promise( (resolve, reject) => {
      var soundRef = ref(soundsRef, id + '.wav')
      var metadata = {
        contentType: 'audio/wav'
      }
      uploadBytes(soundRef, file, metadata)
        .then((snapshot) => {
          this.getURL(snapshot.ref)
            .then((url) => {
              var docRef = doc(firestore, 'imagenes', id)
              updateDoc(docRef, {
                esPublico: true,
                soundscape: url
              })
              resolve(url)
            })
            .catch(error => { reject(error) })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función que almacena una nueva publicación en la base de datos de Firebase.
   * Almacenará únicamente la imagen y la descripción
   * @param {File} file archivo de la imagen
   * @param {string} descripcion descripción de publicación
   * @returns Promesa de la información de la publicación
   */
  async uploadPhoto (file, descripcion) {
    return new Promise((resolve, reject) => {
      var refUser = doc(firestore, 'usuarios', auth.currentUser.uid)
      addDoc(imagenesStore, {
        esPublico: false,
        esReportada: false,
        descripcion: descripcion,
        fecha: Timestamp.now(),
        likes: [],
        numLikes: 0,
        owner: refUser,
        soundscape: ''
      })
        .then((docRef) => {
          var refImages = ref(imagesRef)
          var refImage = ref(refImages, docRef.id + '.jpg')
          uploadBytes(refImage, file)
            .then((snapshot) => {
              this.getURL(snapshot.ref)
                .then((url) => {
                  setDoc(docRef, { name: url }, { merge: true })
                  resolve({
                    id: docRef.id,
                    esPublico: false,
                    esReportada: false,
                    descripcion: descripcion,
                    fecha: Timestamp.now(),
                    likes: [],
                    reporte: [],
                    owner: [auth.currentUser.email, auth.currentUser.displayName, auth.currentUser.photoURL],
                    soundscape: '',
                    name: url
                  })
                })
                .catch(error => { reject(error) })
            })
            .catch(error => { reject(error) })
            })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función que almacena un nuevo comentario en la base de datos, en el documento
   * correspondiente a una publicación
   * @param {string} id id de la imagen comentada
   * @param {string} comment comentario añadido
   * @returns comentario añadido
   */
  async uploadComment (id, comment) {
    var refUser = doc(firestore, 'usuarios', auth.currentUser.uid)
    const comCol = collection(firestore, "imagenes/" + id + "/comentarios")
    var fecha = Timestamp.now()
    const docRef = await addDoc(comCol, {
      autor: refUser,
      comentario: comment,
      fecha: fecha
    })
    var date = new Date (fecha * 1000)
    return {
      id: docRef.id,
      fecha: date.toUTCString(),
      comentario: comment
    }
  },

  /**
   * Función utilizada para eliminar una publicación, eliminando también el paisaje sonoro
   * si fuera necesario.
   * @param {string} id id de la imagen
   * @param {boolean} esPublico indica si la publicación posee paisaje sonoro o no
   * @returns promesa del borrado de la publicación
   */
  removePostById (id, esPublico) {
    return new Promise( (resolve, reject) => {
      var documento = doc(firestore, 'imagenes', id)
      var refImages = ref(imagesRef)
      var refImage = ref(refImages, id + '.jpg')
      deleteObject(refImage)
        .then(() => {
          if (esPublico === true) {
            var refSounds = ref(soundsRef)
            refImage = ref(refSounds, id + '.wav')
            deleteObject(refImage)
              .then(() => {
                deleteDoc(documento)
                .catch((error) => {
                  reject(error)
                })
                resolve()
              })
              .catch((error) => { reject(error) })
          }
          deleteDoc(documento)
            .then(()=>{
              resolve()
            })
            .catch((error) => {
              reject(error)
            })    
        })
        .catch((error) => { reject(error) })
      

    })
  },

  /**
   * Función que elimina el paisaje sonoro generado en una determinada publicación,
   * convirtiéndola en privada.
   * @param {string} id id de la publicación
   * @returns promesa del borrado del paisaje sonoro
   */
  removeSoundscapeId (id) {
    return new Promise((resolve, reject) => {
      var postRef = doc(firestore, 'imagenes', id)
      var refSounds = ref(soundsRef)
      var refSound = ref(refSounds, id + '.wav')
      deleteObject(refSound)
        .catch((error) => { reject(error) })
      updateDoc(postRef, {
        esPublico: false,
        soundscape: ''
      })
      resolve()
    })
  },

  /**
   * Función que elimina un comentario de una publicación
   * @param {string} idImage id de la publicación
   * @param {string} id id del comentario
   * @returns promesa del borrado de la imagen
   */
  removeCommentId (idImage, id) {
    return new Promise((resolve, reject) => {
      var docRef = doc(firestore, 'imagenes/' + idImage + '/comentarios', id)
      deleteDoc(docRef)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función para añadir un like a una publicación. Se añade el email del usuario
   * a la lista de likes de la publicación
   * @param {string} id id de la publicación
   * @param {string} email email del usuario que da like
   * @returns promesa de la lista de likes de la publicación
   */
  givePostLike (id, email) {
    return new Promise((resolve, reject) => {
      var postRef = doc(firestore, 'imagenes', id)
      updateDoc(postRef, { likes: arrayUnion(email), numLikes: increment(1) })
        .then(() => {
          getDoc(postRef)
            .then((docSnap) => {
              resolve(docSnap.data().likes)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función para eliminar un like a una publicación. Se elimina el email del usuario
   * de la lista de likes de la publicación
   * @param {string} id id de la publicación
   * @param {string} email email del usuario que quita el like
   * @returns promesa de la lista de likes de la publicación
   */
  async removePostLike (id, email) {
    return new Promise((resolve, reject) => {
      var postRef = doc(firestore, 'imagenes', id)
      updateDoc(postRef, { likes: arrayRemove(email) })
        .then(() => {
          getDoc(postRef)
            .then((docSnap) => {
              resolve(docSnap.data().likes)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función que actualiza la descripción de una publicación
   * @param {string} id id de la publicación
   * @param {string} descripcion descripción de la publicación
   * @returns promesa de la modificación de la publicación
   */
  async editDescriptionById (id, descripcion) {
    return new Promise ((resolve, reject) => {
      var docRef = doc(firestore, 'imagenes', id)
      updateDoc(docRef, {
        descripcion: descripcion
      })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función que almacena un nuevo reporte en una publicación
   * @param {string} id id de la publicación
   * @param {string} descripcion descripción del reporte
   * @returns promesa del reporte de la publicación
   */
  async reportPostById (id, descripcion) {
    return new Promise((resolve, reject) => {
      const postRef = doc(firestore, 'imagenes', id)
      updateDoc(postRef, { esReportada: true, reporte: arrayUnion(descripcion) })
        .then(() => {
          getDoc(postRef)
            .then((docSnap) => {
              resolve(docSnap.data().reporte)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * Función que elimina los reportes de una publicación cuando el administrador
   * quiera rechazar sus reportes
   * @param {string} id id de la publicación
   * @returns promesa del rechazo del reporte
   */
  declineReportId (id) {
    return new Promise((resolve, reject) => {
      const postRef = doc(firestore, 'imagenes', id)
      updateDoc(postRef, { esReportado: false, reporte: [] })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
