import React, { useState, useEffect } from 'react'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { RedirectHandler } from './pages/RedirectHandler'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('signup')
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      setCurrentPage('shorten')
    }
  }, [])

  const handleAuthSuccess = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)

    if (message.includes('Login')) {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        setToken(savedToken)
        setCurrentPage('shorten')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setCurrentPage('login')
    setNotification('Logged out successfully')
    setTimeout(() => setNotification(''), 3000)
  }

  /* Check for redirection route */
  const path = window.location.pathname
  if (path.startsWith('/short/')) {
    return <RedirectHandler />
  }

  return (
    <div className="app">
      {notification && (
        <div className={`notification ${notification.includes('error') ? 'error' : 'success'}`}>
          {notification}
        </div>
      )}

      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <Login onSuccess={handleAuthSuccess} />
      )}
    </div>
  )
}

export default App
