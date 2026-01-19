import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

export function Login({ onSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_URL;

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/user/login`, loginData);
      localStorage.setItem('token', response.data.token);
      if (onSuccess) onSuccess('Login successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/user/signup`, signupData);
      localStorage.setItem('token', response.data.token || '');
      // Auto-login after signup
      const loginResponse = await axios.post(`${API}/user/login`, {
        email: signupData.email,
        password: signupData.password
      });
      localStorage.setItem('token', loginResponse.data.token);
      if (onSuccess) onSuccess('Signup successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-container">
      <div className="modern-auth-card">
        <div className="auth-brand">
          <div className="brand-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#14B8A6" />
              <path d="M16 8L22 16L16 24L10 16L16 8Z" fill="white" />
            </svg>
          </div>
          <h1 className="brand-name">Shorten.it</h1>
        </div>

        <h2 className="auth-title">Shorten. Track. Grow.</h2>
        <p className="auth-description">Your links, amplified with real-time analytics.</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="modern-auth-form">
            <div className="social-buttons">
              <button type="button" className="social-button">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                  <path fill="currentColor" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                  <path fill="currentColor" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                  <path fill="currentColor" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                </svg>
                Google
              </button>
              <button type="button" className="social-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="divider-text">OR EMAIL</div>

            <div className="form-field">
              <label htmlFor="login-email">EMAIL ADDRESS</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 5l8 5 8-5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="label-row">
                <label htmlFor="login-password">PASSWORD</label>
                <a href="#" className="forgot-link">Forget?</a>
              </div>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="8" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 8V6a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <button type="button" className="password-toggle">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Continue'}
            </button>

            <p className="terms-text">
              By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="modern-auth-form">
            <div className="social-buttons">
              <button type="button" className="social-button">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                  <path fill="currentColor" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                  <path fill="currentColor" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                  <path fill="currentColor" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                </svg>
                Google
              </button>
              <button type="button" className="social-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="divider-text">OR EMAIL</div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="firstname">FIRST NAME</label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  placeholder="John"
                  value={signupData.firstname}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="lastname">LAST NAME</label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  placeholder="Doe"
                  value={signupData.lastname}
                  onChange={handleSignupChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-email">EMAIL ADDRESS</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 5l8 5 8-5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-password">PASSWORD</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="8" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 8V6a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  minLength="6"
                />
                <button type="button" className="password-toggle">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating account...' : 'Continue'}
            </button>

            <p className="terms-text">
              By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>
        )}

        <div className="auth-footer">
          <div className="stat">
            <div className="stat-value">12M+</div>
            <div className="stat-label">LINKS CREATED</div>
          </div>
          <div className="stat">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">UPTIME RATE</div>
          </div>
          <div className="stat">
            <div className="stat-value">24/7</div>
            <div className="stat-label">MONITORING</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
