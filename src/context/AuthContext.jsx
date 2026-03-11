import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load check if user is already logged in via token
  useEffect(() => {
    const token = localStorage.getItem('railconnect_token')
    const savedUser = localStorage.getItem('railconnect_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // TODO: Replace with real API call when backend is ready
      // const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
      // const { token, user } = res.data
      // localStorage.setItem('railconnect_token', token)
      // localStorage.setItem('railconnect_user', JSON.stringify(user))
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // setUser(user)
      // return { success: true }

      // TEMP: Remove below when backend is ready
      throw new Error('Backend not connected yet')

    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      // TODO: Replace with real API call when backend is ready
      // const res = await axios.post(`${API_BASE_URL}/auth/register`, formData)
      // return { success: true }

      // TEMP: Remove below when backend is ready
      throw new Error('Backend not connected yet')

    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('railconnect_token')
    localStorage.removeItem('railconnect_user')
    delete axios.defaults.headers.common['Authorization']
    // TODO: optionally call logout API
    // axios.post(`${API_BASE_URL}/auth/logout`)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext