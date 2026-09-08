const text = (value) => String(value ?? '')

export const isEmpty = (value) => text(value).trim() === ''
export const isValidName = (value) => /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(text(value).trim())
export const isValidPassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)\S+$/.test(text(value))
export const isValidMobile = (value) => /^\d{10}$/.test(text(value))
export const isValidUsername = (value) => /^(?=[A-Za-z0-9]*[^A-Za-z0-9\s][A-Za-z0-9]*$)[A-Za-z0-9\S]+$/.test(text(value))
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(value))
