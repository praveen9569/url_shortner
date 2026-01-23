import React, { useState } from 'react'
import axios from 'axios'
import './Shorten.css'

export function Shorten({ token }) {
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [shortenedUrls, setShortenedUrls] = useState([])

  // ✅ Backend base URL from .env
  const API = import.meta.env.VITE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(null)

    try {
      const response = await axios.post(
        `${API}/shorten`,
        { url, code: code || undefined },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      setShortenedUrls([response.data, ...shortenedUrls])
      setUrl('')
      setCode('')
      setSuccess(response.data)

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to shorten URL')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (shortcode) => {
    const shortUrl = `${API}/short/${shortcode}`
    navigator.clipboard.writeText(shortUrl)
    alert('Copied to clipboard!')
  }

  return (
    <div className="shorten-container fadeIn">
      <div className="shorten-card">
        <h1>Shorten Your URL</h1>
        <p className="shorten-subtitle">Create a short, shareable link</p>

        <form onSubmit={handleSubmit} className="shorten-form">
          <div className="form-group">
            <label>URL to Shorten</label>
            <input
              type="url"
              placeholder="https://example.com/long/url/here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Custom Code (Optional)</label>
            <input
              type="text"
              placeholder="mycode123"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-input"
              maxLength="155"
            />
            <small>Leave empty for auto-generated code</small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              ✅ URL shortened successfully!
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {shortenedUrls.length > 0 && (
          <div className="urls-history slideIn">
            <h2>Recent URLs</h2>
            <div className="urls-list">
              {shortenedUrls.map((item) => (
                <div key={item.id} className="url-item">
                  <div className="url-info">
                    <p className="short-code">{item.shortcode}</p>
                    <p className="target-url">{item.targetURL}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.shortcode)}
                    className="btn btn-secondary btn-small"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
