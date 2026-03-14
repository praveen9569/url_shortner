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
      
      // Auto-login instantly using the token returned from the signup backend fix
      const newToken = response.data.token;
      if (newToken) {
         localStorage.setItem('token', newToken);
         if (onSuccess) onSuccess('Account created and logged in successfully!');
      } else {
         setError('Account created, but failed to auto-login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      {/* LEFT PANEL: FANCY BRANDING */}
      <div className="split-left">
         <div className="brand-logo">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="logo-icon">
             <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
           </svg>
           <span>CustomLink Pro</span>
         </div>

         <div className="left-content">
            <h1 className="left-title">Manage your links with precision.</h1>
            <p className="left-subtitle">Join thousands of professionals using CustomLink Pro to track, optimize, and brand their digital presence.</p>
         </div>

         {/* Decorative Crosshairs / Targets */}
         <div className="decorative-circle dec-1"></div>
         <div className="decorative-circle dec-2"></div>
         <div className="decorative-line vertical"></div>
         <div className="decorative-line horizontal"></div>

         <div className="carousel-indicators">
            <div className="indicator active"></div>
            <div className="indicator"></div>
            <div className="indicator"></div>
         </div>
      </div>

      {/* RIGHT PANEL: FORMS */}
      <div className="split-right">
        <div className="form-container">
          <div className="form-header">
             <h2>{activeTab === 'login' ? 'Welcome back' : 'Create an account'}</h2>
             <p>Enter your credentials to access your account</p>
          </div>

          <button className="google-btn">
             <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
                <path fill="#FBBC05" d="M3.964 10.707a5.41 5.41 0 0 1-.282-1.707c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58Z"/>
             </svg>
             Continue with Google
          </button>

          <div className="divider">
            <span>OR EMAIL</span>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="split-form">
              <div className="input-group">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label>Password</label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <div className="password-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <button type="button" className="eye-btn">👁</button>
                </div>
              </div>

              {error && <div className="error-alert">{error}</div>}

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="split-form">
               <div className="input-row">
                  <div className="input-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      placeholder="John"
                      value={signupData.firstname}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Doe"
                      value={signupData.lastname}
                      onChange={handleSignupChange}
                    />
                  </div>
               </div>

              <div className="input-group">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label>Password</label>
                </div>
                <div className="password-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    minLength="6"
                  />
                  <button type="button" className="eye-btn">👁</button>
                </div>
              </div>

              {error && <div className="error-alert">{error}</div>}

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="toggle-footer">
             {activeTab === 'login' ? (
                <>Don't have an account? <span onClick={() => setActiveTab('signup')}>Sign up for free</span></>
             ) : (
                <>Already have an account? <span onClick={() => setActiveTab('login')}>Log in</span></>
             )}
          </div>

          <div className="meta-links">
             <a href="#">Privacy Policy</a>
             <a href="#">Terms of Service</a>
             <a href="#">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
