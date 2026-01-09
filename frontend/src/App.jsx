import React, { useState, useEffect } from 'react'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Shorten } from './pages/Shorten'
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

  return (
    <div className="app">
      {notification && (
        <div className={`notification ${notification.includes('error') ? 'error' : 'success'}`}>
          {notification}
        </div>
      )}

      {token ? (
        <div className="app-content">
          <header className="app-header">
            <h1 className="logo">🔗 ShortLink</h1>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </header>
          <Shorten token={token} />
        </div>
      ) : (
        <div className="auth-wrapper">
          {currentPage === 'signup' ? (
            <Signup onToggle={setCurrentPage} />
          ) : (
            <Login onToggle={setCurrentPage} onSuccess={handleAuthSuccess} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
