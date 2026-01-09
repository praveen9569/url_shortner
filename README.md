# 🔗 URL Shortener - Production-Grade Full-Stack Application

A modern, scalable URL shortening service built with Node.js, Express, React, and PostgreSQL. Features JWT authentication, analytics tracking, and cloud deployment.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-url.vercel.app)
[![Backend](https://img.shields.io/badge/backend-railway-blueviolet)](https://railway.app)
[![Frontend](https://img.shields.io/badge/frontend-vercel-black)](https://vercel.com)

---

## ✨ Features

- 🚀 **Fast URL Shortening** - Generate short links instantly
- 🔐 **JWT Authentication** - Secure user sessions
- 🎨 **Custom Shortcodes** - Create memorable short URLs
- 📊 **Analytics** - Track clicks and usage statistics
- 🌐 **Production Ready** - Deployed on Railway & Vercel
- 🔒 **CORS Protected** - Secure API endpoints
- 📱 **Responsive UI** - Works on all devices

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Security:** CORS, Helmet
- **Hosting:** Railway

### Frontend
- **Framework:** React
- **Styling:** CSS/Tailwind (customize as needed)
- **HTTP Client:** Axios/Fetch
- **Hosting:** Vercel

---

## 🔗 How It Works

### URL Shortening Workflow

1. **User enters a long URL**
2. **(Optional)** User provides a custom shortcode
3. **Backend:**
   - Generates a unique shortcode (if not provided)
   - Stores mapping in PostgreSQL
4. **Short URL is returned:**
   ```
   https://short.url/abc123
   ```
5. **When accessed:**
   - Backend looks up the code
   - Redirects to the original long URL

---

## 🌐 Production Deployment

### Backend (Railway)

**Hosted using Railway**

**Environment Variables:**
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-secret-key-here
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**CORS configured to allow frontend domain**

### Frontend (Vercel)

**Deployed via GitHub integration**

**Environment Variable:**
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

---

## ⚙️ CORS & Security

**CORS configured using official middleware:**

```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**JWT ensures:**
- ✅ Only authenticated users can shorten URLs
- ✅ Public access allowed only for redirects

---

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── urlController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── urlModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── urlRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🧪 Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file:**

```env
DATABASE_URL=postgresql://localhost:5432/url_shortener
JWT_SECRET=your-local-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Run backend:**

```bash
npm start
```

Backend runs on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env` file:**

```env
REACT_APP_API_URL=http://localhost:5000
```

**Run frontend:**

```bash
npm start
```

Frontend runs on `http://localhost:3000`

---

## 🧠 Production Practices Used

- ✅ Environment-based configuration (`.env`)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Modular folder structure
- ✅ Secure API headers
- ✅ Cloud-hosted database
- ✅ Frontend & backend separation
- ✅ Error handling & validation
- ✅ RESTful API design

---

## 📈 Future Enhancements

- 📊 **Click analytics** per URL
- ⏳ **Expiry dates** for short links
- 👥 **User dashboard** with link management
- 🔐 **Password hashing** with bcrypt
- 📦 **Dockerized** production builds
- 🌍 **Custom domain** support
- 🔍 **QR code** generation
- 📧 **Email notifications**

---

## 🚀 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### URL Shortening
```
POST   /api/url/shorten  - Create short URL (Auth required)
GET    /api/url/:code    - Redirect to original URL
GET    /api/url/stats    - Get user's URL statistics (Auth required)
DELETE /api/url/:code    - Delete short URL (Auth required)
```



## 👨‍💻 Author

**Praveen Kumar Nishad**  
Final Year Student | Backend & Full-Stack Developer  
Focused on building production-grade applications with scalable architecture.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/yourusername)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-green)](https://yourportfolio.com)

---

## ⭐ If You Like This Project

- ⭐ **Star** the repository
- 🔀 **Fork** it for your own projects
- 📢 **Share** it with others
- 💡 Use it as a base for your own SaaS projects

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<div align="center">
Made with ❤️ by Praveen Kumar Nishad
</div>
