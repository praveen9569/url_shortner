# URL Shortener - Full Stack

## 🚀 Quick Start

### Backend Setup
```bash
cd url-shortner
pnpm install
npm run db:push
npm run dev
```

Backend runs on: **http://localhost:3000**

### Frontend Setup
```bash
cd frontend
pnpm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 📁 Project Structure

```
url-shortner/
├── backend (Node.js + Express)
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── middlewares/
│   └── index.js
│
└── frontend (React + Vite)
    ├── src/
    │   ├── pages/
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── Shorten.jsx
    │   │   └── styles
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── index.html
```

---

## ✨ Features

### Backend
- ✅ User signup with password hashing
- ✅ User login with JWT tokens
- ✅ URL shortening with custom codes
- ✅ Authentication middleware
- ✅ PostgreSQL database

### Frontend
- ✅ Beautiful gradient UI
- ✅ Smooth animations
- ✅ Signup form
- ✅ Login form
- ✅ URL shortening interface
- ✅ Recent URLs list
- ✅ Copy to clipboard
- ✅ Responsive design

---

## 🎨 Design Features

- **Gradient Background**: Purple to pink gradient
- **Smooth Animations**: Fade-in, slide-in effects
- **Clean Cards**: Modern card-based layout
- **Responsive**: Works on mobile, tablet, desktop
- **Dark Mode Ready**: Easy to add dark mode
- **Interactive Elements**: Hover effects, smooth transitions

---

## 📝 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/user/signup` | ❌ | Create user |
| POST | `/user/login` | ❌ | Get JWT token |
| POST | `/shorten` | ✅ | Create short URL |

---

## 🔐 Authentication

Tokens are stored in `localStorage` and automatically sent with API requests via the Authorization header.

---

## 🎯 Notes

- Backend and frontend run on **different ports**
- Frontend proxies API requests to backend
- All data persists in PostgreSQL
- Tokens expire after 1 hour
- No breaking changes to backend

---

**Built with ❤️ using React + Vite + Node.js**
