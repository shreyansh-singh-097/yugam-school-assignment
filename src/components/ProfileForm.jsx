import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  isEmpty,
  isValidEmail,
  isValidMobile,
  isValidName,
  isValidPassword,
  isValidUsername,
} from '../utils/validation'

export default function ProfileForm({ values, onChange, onLogout }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    onChange({ ...values, [name]: value })
    setErrors((current) => ({ ...current, [name]: '' }))
    setStatus('')
  }

  const validateForm = () => {
    const nextErrors = {}
    if (isEmpty(values.name)) nextErrors.name = 'Name cannot be empty.'
    else if (!isValidName(values.name)) nextErrors.name = 'Use letters and spaces only.'

    if (isEmpty(values.password)) nextErrors.password = 'Password cannot be empty.'
    else if (!isValidPassword(values.password)) nextErrors.password = 'Include at least one letter and one number.'

    if (isEmpty(values.mobile)) nextErrors.mobile = 'Mobile number cannot be empty.'
    else if (!isValidMobile(values.mobile)) nextErrors.mobile = 'Enter exactly 10 digits.'

    if (isEmpty(values.username)) nextErrors.username = 'Username cannot be empty.'
    else if (!isValidUsername(values.username)) nextErrors.username = 'Use alphanumeric characters and exactly one special character.'

    if (isEmpty(values.email)) nextErrors.email = 'Email cannot be empty.'
    else if (!isValidEmail(values.email)) nextErrors.email = 'Enter a valid email address.'

    setErrors(nextErrors)
    setStatus(Object.keys(nextErrors).length === 0 ? 'All details look good.' : '')
  }

  const logout = async () => {
    setIsLoggingOut(true)
    setStatus('')
    try {
      await signOut(auth)
      onLogout()
    } catch {
      setStatus('Logout failed. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const inputClass = (field) => (errors[field] ? 'input-error' : '')

  return (
    <section className="app-card" aria-labelledby="profile-heading">
      <header className="card-header profile-topbar">
        <div>
          <p className="eyebrow">Profile details</p>
          <h1 id="profile-heading">Complete your profile</h1>
          <p>Please check your details and add the remaining information.</p>
        </div>
        <button className="secondary-button logout-button" type="button" onClick={logout} disabled={isLoggingOut}>{isLoggingOut ? 'Logging out...' : 'Logout'}</button>
      </header>
      <div className="form-body">
        {status && <p className={`form-message ${status === 'All details look good.' ? 'success' : 'error'}`} role="status">{status}</p>}
        <div className="field-group">
          <label htmlFor="profile-name">Name</label>
          <input className={inputClass('name')} id="profile-name" name="name" value={values.name} onChange={updateField} autoComplete="name" />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div className="field-group">
          <label htmlFor="profile-password">Password</label>
          <input className={inputClass('password')} id="profile-password" name="password" type="password" value={values.password} onChange={updateField} autoComplete="current-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <div className="field-group">
          <label htmlFor="profile-mobile">Mobile Number</label>
          <input className={inputClass('mobile')} id="profile-mobile" name="mobile" type="tel" inputMode="numeric" maxLength="10" value={values.mobile} onChange={updateField} placeholder="10-digit mobile number" />
          {errors.mobile && <p className="field-error">{errors.mobile}</p>}
        </div>
        <div className="field-group">
          <label htmlFor="profile-username">Username</label>
          <input className={inputClass('username')} id="profile-username" name="username" value={values.username} onChange={updateField} placeholder="e.g. yugam_user" autoComplete="username" />
          {errors.username && <p className="field-error">{errors.username}</p>}
        </div>
        <div className="field-group">
          <label htmlFor="profile-email">Email</label>
          <input className={inputClass('email')} id="profile-email" name="email" type="email" value={values.email} onChange={updateField} autoComplete="email" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <button className="primary-button" type="button" onClick={validateForm}>Validate Details</button>
      </div>
    </section>
  )
}
