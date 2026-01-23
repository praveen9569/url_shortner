import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

export function Dashboard({ token, onLogout }) {
    const [stats, setStats] = useState({
        totalClicks: 0,
        activeLinks: 0,
        topLocation: { country: 'Unknown', percentage: 0 }
    });
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('overview'); // 'overview', 'links', 'analytics'
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newUrl, setNewUrl] = useState({ url: '', code: '' });
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch overview stats
            const statsResponse = await axios.get(`${API}/api/analytics/overview`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsResponse.data);

            // Fetch user URLs
            const urlsResponse = await axios.get(`${API}/api/analytics/urls`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUrls(urlsResponse.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (shortcode) => {
        const shortUrl = `${API}/short/${shortcode}`;
        navigator.clipboard.writeText(shortUrl);
        alert('Short URL copied to clipboard!');
    };

    const filteredUrls = urls.filter(url =>
        url.targetURL.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.shortcode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCountryFlag = (country) => {
        const countryFlags = {
            'United States': '🇺🇸',
            'India': '🇮🇳',
            'United Kingdom': '🇬🇧',
            'Canada': '🇨🇦',
            'Germany': '🇩🇪',
            'France': '🇫🇷',
            'Unknown': '🌍'
        };
        return countryFlags[country] || '🌍';
    };

    const handleCreateUrl = async (e) => {
        e.preventDefault();
        setCreating(true);
        setCreateError('');

        try {
            const response = await axios.post(`${API}/shorten`, newUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh dashboard data
            await fetchDashboardData();

            // Reset form and close modal
            setNewUrl({ url: '', code: '' });
            setShowModal(false);
            alert('Short URL created successfully!');
        } catch (error) {
            setCreateError(error.response?.data?.error || 'Failed to create short URL');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#14B8A6" />
                            <path d="M16 8L22 16L16 24L10 16L16 8Z" fill="white" />
                        </svg>
                        <span>LinkShort Pro</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveView('overview')}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Dashboard
                    </button>

                    <button
                        className={`nav-item ${activeView === 'links' ? 'active' : ''}`}
                        onClick={() => setActiveView('links')}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 6L14 10L10 14M6 6L10 10L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        My Links
                    </button>

                    <button
                        className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveView('analytics')}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 17V12M10 17V7M17 17V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Analytics
                    </button>

                    <button className="nav-item">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M10 7v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Settings
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="system-status">
                        <div className="status-indicator"></div>
                        <span>ALL OPERATIONAL</span>
                    </div>
                    <div className="api-version">API v2.4</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Top Bar */}
                <header className="dashboard-header">
                    <h1 className="dashboard-title">
                        {activeView === 'overview' && 'Dashboard Overview'}
                        {activeView === 'links' && 'My Links'}
                        {activeView === 'analytics' && 'Analytics'}
                    </h1>

                    <div className="header-actions">
                        <button className="btn-export">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 2v8M5 7l3 3 3-3M2 12v2h12v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Export CSV
                        </button>
                        <button className="user-avatar" onClick={onLogout}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <circle cx="10" cy="6" r="3" />
                                <path d="M4 18c0-3.5 2.5-6 6-6s6 2.5 6 6" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Overview View */}
                {activeView === 'overview' && (
                    <div className="dashboard-content">
                        <p className="welcome-text">Welcome back, here is what's happening with your links.</p>

                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <span className="stat-label">TOTAL CLICKS</span>
                                </div>
                                <div className="stat-value">{stats.totalClicks.toLocaleString()}</div>
                                <div className="stat-trend positive">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    +12%
                                </div>
                                <div className="stat-progress">
                                    <div className="progress-bar" style={{ width: '65%' }}></div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <span className="stat-label">ACTIVE LINKS</span>
                                </div>
                                <div className="stat-value">{stats.activeLinks}</div>
                                <div className="stat-meta">
                                    <span className="meta-highlight">+5</span> 3 links pending review
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <span className="stat-label">TOP LOCATION</span>
                                </div>
                                <div className="location-info">
                                    <span className="country-flag">{getCountryFlag(stats.topLocation.country)}</span>
                                    <div>
                                        <div className="country-name">{stats.topLocation.country}</div>
                                        <div className="country-stat">{stats.topLocation.percentage}% of total traffic</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* URLs Table */}
                        <div className="urls-section">
                            <div className="section-header">
                                <div className="search-bar">
                                    <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search shortened URLs, tags or original links..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="table-actions">
                                    <button className="btn-icon">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M3 6h14M7 10h10M5 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        FILTER
                                    </button>
                                    <button className="btn-icon">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M4 8h12M4 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        SORT
                                    </button>
                                </div>
                            </div>

                            <div className="urls-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ORIGINAL DESTINATION</th>
                                            <th>SHORT URL</th>
                                            <th>CLICKS</th>
                                            <th>STATUS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUrls.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="empty-state">
                                                    No URLs found. Create your first short link!
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUrls.slice(0, 3).map((url) => (
                                                <tr key={url.id}>
                                                    <td>
                                                        <div className="url-cell">
                                                            <div className="url-title">{url.targetURL.substring(0, 50)}...</div>
                                                            <div className="url-meta">{url.targetURL}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="short-url-cell">
                                                            <code>shrt.ly/{url.shortcode}</code>
                                                            <button
                                                                className="btn-copy"
                                                                onClick={() => copyToClipboard(url.shortcode)}
                                                                title="Copy"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                                                    <path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.5" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="clicks-cell">
                                                            <strong>{url.clicks.toLocaleString()}</strong>
                                                            {url.clicks > 100 && <span className="trend-badge">+16% this week</span>}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="status-badge active">● ACTIVE</span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button className="btn-action" title="View Analytics">📊</button>
                                                            <button className="btn-action" title="Edit">✏️</button>
                                                            <button className="btn-action" title="Delete">🗑️</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="table-footer">
                                <div className="showing-text">Showing 1-3 of {urls.length} links</div>
                                <div className="pagination">
                                    <button className="page-btn">←</button>
                                    <button className="page-btn active">1</button>
                                    <button className="page-btn">2</button>
                                    <button className="page-btn">3</button>
                                    <button className="page-btn">→</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Links View */}
                {activeView === 'links' && (
                    <div className="dashboard-content">
                        <p className="welcome-text">Manage all your shortened links</p>
                        <div className="empty-state-large">
                            <h3>My Links view coming soon!</h3>
                            <p>This will show all your URLs with advanced filtering and management options.</p>
                        </div>
                    </div>
                )}

                {/* Analytics View */}
                {activeView === 'analytics' && (
                    <div className="dashboard-content">
                        <p className="welcome-text">Detailed analytics and insights</p>
                        <div className="empty-state-large">
                            <h3>Analytics view coming soon!</h3>
                            <p>This will show charts, graphs, and detailed statistics about your links.</p>
                        </div>
                    </div>
                )}

                {/* Floating Action Button */}
                <button className="fab" onClick={() => setShowModal(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Create New Link
                </button>

                {/* Create URL Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Create New Short Link</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateUrl} className="modal-form">
                                <div className="form-field">
                                    <label htmlFor="url">DESTINATION URL</label>
                                    <input
                                        id="url"
                                        type="url"
                                        placeholder="https://example.com/your-long-url"
                                        value={newUrl.url}
                                        onChange={(e) => setNewUrl({ ...newUrl, url: e.target.value })}
                                        required
                                    />
                                    <small>Enter the long URL you want to shorten</small>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="code">CUSTOM SHORT CODE (OPTIONAL)</label>
                                    <input
                                        id="code"
                                        type="text"
                                        placeholder="my-custom-link"
                                        value={newUrl.code}
                                        onChange={(e) => setNewUrl({ ...newUrl, code: e.target.value })}
                                    />
                                    <small>Leave blank for auto-generated code</small>
                                </div>

                                {createError && <div className="error-alert">{createError}</div>}

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={creating}
                                    >
                                        {creating ? 'Creating...' : 'Create Short Link'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
