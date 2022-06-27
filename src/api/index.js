import { auth, storage, firestore } from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail, sendEmailVerification, updatePassword, deleteUser } from 'firebase/auth'
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { collection, getDocs, addDoc, setDoc, Timestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc } from 'firebase/firestore'

const imagesRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/userImages')
const soundsRef = ref(storage, 'gs://musicfactory-4cc4a.appspot.com/soundscapes')
const imagenesStore = collection(firestore, 'imagenes')

export default{
  login (email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  },

  getUser () {
    return auth.currentUser
  },

  register (email, password, name, surname) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: name + ' ' + surname
        })
        sendEmailVerification(userCredential.user)
      })
      .then(() => signOut(auth))
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

  async changeUserInfo (displayName, posts) {
    posts.forEach(async function (post) {
      var docRef = doc(firestore, 'imagenes', post.id)
      var docSnap = await getDoc(docRef)
      var usuario = [docSnap.data().owner[0], displayName]
      await updateDoc(docRef, { owner: usuario })
    })
    const user = this.getUser()
    return updateProfile(user, { displayName: displayName })
  },

  deleteUserAccount () {
    const user = this.getUser()
    return deleteUser(user)
  },

  async getAllImages () {
    const query = await getDocs(imagenesStore)
    return query
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

  async uploadPhoto (file, email, displayName) {
    const docRef = await addDoc(imagenesStore, {
      esPublico: false,
      esReportada: false,
      fecha: Timestamp.now(),
      likes: [],
      numLikes: 0,
      owner: [email, displayName],
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
                fecha: Timestamp.now(),
                likes: [],
                reporte: [],
                numLikes: 0,
                owner: [email, displayName],
                soundscape: '',
                name: url
              })
            })
            .catch(error => { reject(error) })
        })
        .catch(error => { reject(error) })
    })
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
