import { auth, storage, firestore } from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail, sendEmailVerification, updatePassword, deleteUser } from 'firebase/auth'
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { collection, getDocs, addDoc, setDoc, Timestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc, query, orderBy, limit, startAfter } from 'firebase/firestore'

const imagesRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/userImages')
const soundsRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/soundscapes')
const profileRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/profileImages')
const imagenesStore = collection(firestore, 'imagenes')

export default{
  login (email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  },

  getUser () {
    return auth.currentUser
  },

  async getUserData () {
    const user = auth.currentUser
    var docRef = doc(firestore, 'usuarios', user.uid)
    var docSnap = await getDoc(docRef)
    return {email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      descripcion: docSnap.data().descripcion,
      siguiendo: docSnap.data().siguiendo
    }
  },

  register (email, password, name, surname, profilePhoto) {
    return new Promise ( (resolve, reject) => {
      if (profilePhoto !== '') {
        debugger
        var refImage = ref(profileRef, email + '.jpg')
        uploadBytes(refImage, profilePhoto)
          .then((snapshot) => {
            debugger
            this.getURL(snapshot.ref)
              .then((url) => {
                debugger
                resolve(createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    debugger
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

  resetPass (email) {
    return sendPasswordResetEmail(auth, email)
  },

  logOut () {
    return signOut(auth)
  },

  changeUserPassword (newPassword) {
    const user = this.getUser()
    return updatePassword(user, newPassword)
  },

  async changeUserInfo (displayName, profilePhoto, descripcion) {
    const user = this.getUser()
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

  deleteUserAccount () {
    const user = auth.currentUser
    var docRef = doc(firestore, 'usuarios', user.uid)
    deleteDoc(docRef)
    return deleteUser(user)
  },

  async followByEmail (email) {
    const user = auth.currentUser
    var docRef = doc(firestore, 'usuarios', user.uid)
    await updateDoc(docRef, {
      siguiendo: arrayUnion(email)
    })
  },

  async stopFollowByEmail (email) {
    const user = auth.currentUser
    var docRef = doc(firestore, 'usuarios', user.uid)
    await updateDoc(docRef, {
      siguiendo: arrayRemove(email)
    })
  },

  async getAllImages () {
    const peticion = query(imagenesStore, orderBy("fecha", "desc"))
    const documentos = await getDocs(peticion)
    var images = []
    for (const doc of documentos.docs) {
      var owner = await getDoc(doc.data().owner)
      var image = {
        id: doc.id,
        ...doc.data(),
        owner: [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion]
      }
      images.push(image)
    }
    return images
  },

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
      var date = new Date (doc.data().fecha * 1000)
      var comment = {
        id: doc.id,
        comentario:doc.data().comentario,
        fecha: date.toUTCString(),
        autor: [owner.data().email, owner.data().nombre, owner.data().photoURL, owner.data().descripcion]
      }
      comments.push(comment)
    }
    return comments
  },

  getImagesByUser (email) {
    var refImages = ref(imagesRef, email)
    return listAll(refImages)
  },

  getURL (imagen) {
    return getDownloadURL(imagen)
  },

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

  async uploadPhoto (file, descripcion) {
    debugger
    var refUser = doc(firestore, 'usuarios', auth.currentUser.uid)
    const docRef = await addDoc(imagenesStore, {
      esPublico: false,
      esReportada: false,
      descripcion: descripcion,
      fecha: Timestamp.now(),
      likes: [],
      numLikes: 0,
      owner: refUser,
      soundscape: ''
    })
    return new Promise((resolve, reject) => {
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
  },

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

  removePostById (id, esPublico) {
    return new Promise( (resolve, reject) => {
      var documento = doc(firestore, 'imagenes', id)
      var refImages = ref(imagesRef)
      var refImage = ref(refImages, id + '.jpg')
      deleteObject(refImage)
        .catch((error) => { reject(error) })
      var refSounds = ref(soundsRef)
      if (esPublico === true) {
        refImage = ref(refSounds, id + '.wav')
        deleteObject(refImage)
          .catch((error) => { reject(error) })
      }
      deleteDoc(documento)
          .then(()=>{
            resolve()
              }
          )

    })
  },

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

  async removeCommentId (idImage, id) {
    var docRef = doc(firestore, 'imagenes/' + idImage + '/comentarios', id)
    return await deleteDoc(docRef)
  },

  async givePostLike (id, email) {
    var postRef = doc(firestore, 'imagenes', id)
    await updateDoc(postRef, { likes: arrayUnion(email), numLikes: increment(1) })
    var docSnap = await getDoc(postRef)
    return docSnap.data().likes
  },

  async removePostLike (id, email) {
    var postRef = doc(firestore, 'imagenes', id)
    await updateDoc(postRef, { likes: arrayRemove(email), numLikes: increment(-1) })
    var docSnap = await getDoc(postRef)
    return docSnap.data().likes
  },

  async editDescriptionById (id, descripcion) {
    var docRef = doc(firestore, 'imagenes', id)
    await updateDoc(docRef, {
      descripcion: descripcion
    })
  },

  async reportPostById (id, descripcion) {
    const postRef = doc(firestore, 'imagenes', id)
    await updateDoc(postRef, { esReportado: true, reporte: arrayUnion(descripcion) })
    var docSnap = await getDoc(postRef)
    var reports = docSnap.data().reporte
    return reports
  },

  declineReportId (id) {
    return new Promise((resolve) => {
      const postRef = doc(firestore, 'imagenes', id)
      updateDoc(postRef, { esReportado: false, reporte: [] })
      resolve()
    })
  }
}
