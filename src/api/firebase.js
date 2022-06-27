import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

import settings from './settings'

const firebaseApp = initializeApp(settings)

export const auth = getAuth()
export const storage = getStorage(firebaseApp)
export const firestore = getFirestore(firebaseApp)
export default firebaseApp
