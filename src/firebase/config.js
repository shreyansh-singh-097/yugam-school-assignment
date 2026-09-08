import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Copy .env.example to .env and replace each value with your Firebase Web app config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

export const isFirebaseConfigured = !Object.values(firebaseConfig).some((value) => value.startsWith('YOUR_'))

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app
