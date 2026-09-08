import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase/config'
import { isEmpty, isValidEmail, isValidName, isValidPassword } from '../utils/validation'

const initialForm = { name: '', email: '', password: '' }

export default function Register({ onRegistered }) {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const changeField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitForm = async (event) => {
    event.preventDefault()

    if (isEmpty(form.name) || isEmpty(form.email) || isEmpty(form.password)) {
      setMessage('Please fill in all three fields.')
      return
    }
    if (!isValidName(form.name)) {
      setMessage('Name can contain letters and spaces only.')
      return
    }
    if (!isValidEmail(form.email)) {
      setMessage('Please enter a valid email address.')
      return
    }
    if (!isValidPassword(form.password)) {
      setMessage('Password needs at least one letter and one number.')
      return
    }

    if (!isFirebaseConfigured) {
      setMessage('Add your Firebase values to the .env file before creating an account.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const name = form.name.trim()
      const email = form.email.trim()
      const result = await createUserWithEmailAndPassword(auth, email, form.password)
      await updateProfile(result.user, { displayName: name })

      onRegistered({ name, email, password: form.password })
    } catch (error) {
      const friendlyMessages = {
        'auth/email-already-in-use': 'An account already exists with this email address.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Please use a stronger password.',
        'auth/operation-not-allowed': 'Email/Password sign-in is not enabled in Firebase Authentication yet.',
        'auth/configuration-not-found': 'Firebase Authentication is not configured for this project yet.',
        'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
        'auth/invalid-api-key': 'Firebase configuration is invalid. Please recheck the values in .env.',
      }
      setMessage(friendlyMessages[error.code] || `Registration failed (${error.code || 'unknown error'}). Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="app-card" aria-labelledby="register-heading">
      <header className="card-header">
        <p className="eyebrow">Account setup</p>
        <h1 id="register-heading">Create your account</h1>
        <p>Enter your details to register for the student portal.</p>
      </header>
      <form className="form-body" onSubmit={submitForm} noValidate>
        {message && <p className="form-message error" role="alert">{message}</p>}
        <div className="field-group">
          <label htmlFor="register-name">Name</label>
          <input id="register-name" name="name" value={form.name} onChange={changeField} autoComplete="name" placeholder="e.g. Yugam Sharma" />
        </div>
        <div className="field-group">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" value={form.email} onChange={changeField} autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="field-group">
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" value={form.password} onChange={changeField} autoComplete="new-password" placeholder="At least one letter and one number" />
        </div>
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Register'}</button>
      </form>
    </section>
  )
}
