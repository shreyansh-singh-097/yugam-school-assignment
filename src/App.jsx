import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase/config'
import Register from './components/Register'
import ProfileForm from './components/ProfileForm'

const emptyProfile = { name: '', email: '', password: '', mobile: '', username: '' }

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(emptyProfile)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setCheckingAuth(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setCheckingAuth(false)

      if (currentUser) {
        setProfile((current) => ({
          ...current,
          name: currentUser.displayName || current.name,
          email: currentUser.email || current.email,
        }))
      } else {
        setProfile(emptyProfile)
      }
    })

    return unsubscribe
  }, [])

  const handleRegistered = (registeredUser) => {
    setProfile({ ...emptyProfile, ...registeredUser })
  }

  if (checkingAuth) return <div className="loading-screen">Loading...</div>

  return (
    <main className="page-shell">
      {user ? (
        <ProfileForm values={profile} onChange={setProfile} onLogout={() => setProfile(emptyProfile)} />
      ) : (
        <Register onRegistered={handleRegistered} />
      )}
    </main>
  )
}
