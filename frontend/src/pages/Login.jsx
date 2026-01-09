import React, { useState } from 'react'
import axios from 'axios'
import './Auth.css'

export function Login({ onToggle, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await axios.post('http://localhost:3000/user/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setSuccess('🎉 Login successful! Redirecting...')
      localStorage.setItem('token', response.data.token)
      setFormData({ email: '', password: '' })
      setTimeout(() => onSuccess('Login successful!'), 1000)
    } catch (err) {
      setError(err.response?.data?.error || err.message || '❌ Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">ShortLink</div>
          <div className="auth-icon">🔐</div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Enter your credentials to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label>Email</label>
            <small>Your registered email</small>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label>Password</label>
            <small>Your password</small>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn" title="Google">G</button>
            <button type="button" className="social-btn" title="GitHub">⚙</button>
            <button type="button" className="social-btn" title="Microsoft">M</button>
          </div>

          <div className="toggle-link">
            Don't have an account? 
            <button type="button" onClick={() => onToggle('signup')}>
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

