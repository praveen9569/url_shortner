import React, { useState } from 'react'
import axios from 'axios'
import './Auth.css'

export function Signup({ onToggle }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
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
      const response = await axios.post('http://localhost:3000/user/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setSuccess('✨ Account created successfully! Redirecting...')
      setFormData({ firstname: '', lastname: '', email: '', password: '' })
      setTimeout(() => onToggle('login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || err.message || '❌ Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">ShortLink</div>
          <div className="auth-icon">✨</div>
          <h1>Get Started</h1>
          <p className="auth-subtitle">Create your account in seconds</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="firstname"
                placeholder="John"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="form-input"
              />
              <label>First Name</label>
              <small>Your first name</small>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="lastname"
                placeholder="Doe"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="form-input"
              />
              <label>Last Name</label>
              <small>Your last name</small>
            </div>
          </div>

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
            <small>We'll never share your email</small>
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
            <small>Min 8 characters</small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? '⏳ Creating...' : '🚀 Get Started'}
          </button>

          <div className="divider">
            <span>or sign up with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn" title="Google">G</button>
            <button type="button" className="social-btn" title="GitHub">⚙</button>
            <button type="button" className="social-btn" title="Microsoft">M</button>
          </div>

          <div className="toggle-link">
            Already have an account? 
            <button type="button" onClick={() => onToggle('login')}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

