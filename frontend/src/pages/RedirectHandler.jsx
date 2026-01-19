import React, { useEffect } from 'react';

export function RedirectHandler() {
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Extract the path from the current location
        // Expected format: /short/:shortcode
        const path = window.location.pathname;

        if (path.startsWith('/short/')) {
            // Construct the backend URL
            // The backend has a route: GET /short/:shortcode
            // We want to navigate the browser there so the backend handles the redirect
            const backendUrl = `${API}${path}`;

            // Perform the redirection
            window.location.href = backendUrl;
        }
    }, []);

    return (
        <div className="redirect-container">
            <div className="redirect-content">
                <div className="spinner"></div>
                <p>Redirecting to your destination...</p>
            </div>
            <style>{`
        .redirect-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #0A1929;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .redirect-content {
          text-align: center;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(20, 184, 166, 0.3);
          border-top-color: #14B8A6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
