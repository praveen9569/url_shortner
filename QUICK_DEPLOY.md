# 🚀 Quick Deployment Checklist - 10 Minute Deployment

## Choose Your Path

### ⚡ **FASTEST PATH: Render** (Recommended)
**Time: 10 minutes | Cost: FREE**

### Step 1: Create `.env` File (2 min)
```bash
# Copy in root directory
DATABASE_URL=your_db_url_here
JWT_SECRET=your-secret-key-here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
PORT=3000
```

### Step 2: Setup Database (2 min)
1. Go to https://render.com → Sign up
2. Click "New +" → "PostgreSQL"
3. Name it: `url-shortener-db`
4. Choose FREE tier
5. Create & copy the External Database URL
6. Paste into DATABASE_URL in `.env`

### Step 3: Deploy Backend (3 min)
1. Push your code to GitHub
2. On Render dashboard: "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   ```
   Name: url-shortener-api
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. Add Environment Variables from your `.env`
6. Click "Deploy"
7. **Copy the URL** (something like: `https://url-shortener-api.onrender.com`)

### Step 4: Deploy Frontend (2 min)
1. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://url-shortener-api.onrender.com
   ```
2. In `frontend` folder, create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: url-shortener-frontend
       buildCommand: npm install && npm run build
       startCommand: npm run preview
   ```
3. Push to GitHub
4. On Render: "New +" → "Web Service"
5. Connect frontend repo
6. Deploy!
7. **Your frontend URL will be displayed**

### Step 5: Test (1 min)
- Open your frontend URL
- Try to sign up
- Try to login
- Create a short URL
- Click the short URL to verify redirect

---

## 📋 Complete Render Setup Summary

| Component | Platform | Time | Cost |
|-----------|----------|------|------|
| Database | Render PostgreSQL | 2 min | FREE |
| Backend | Render Web Service | 3 min | FREE |
| Frontend | Render Web Service | 2 min | FREE |
| **TOTAL** | | **~10 min** | **FREE** |

---

## 🔧 Alternative: Vercel (Also Free)

If you prefer Vercel:

1. Deploy DB on Railway or Supabase (2 min)
2. Deploy backend on Vercel (3 min)
3. Deploy frontend on Vercel (2 min)

Same timeline, slightly different interfaces.

---

## ✅ Verify Everything Works

After deployment, test these:

```
✓ Frontend loads at your-frontend-url.com
✓ Backend API responds (check Network tab in DevTools)
✓ Can create new account
✓ Can login
✓ Can shorten URLs
✓ Shortened URLs redirect correctly
```

---

## 🆘 If Something Goes Wrong

### Backend won't start
- Check environment variables are set
- Check `npm start` works locally: `npm install && npm start`
- Check logs on Render dashboard

### Frontend can't reach backend
- Update `VITE_API_URL` in `.env.production`
- Make sure backend URL is correct
- Check CORS settings in backend

### Database won't connect
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Try connecting locally first

---

## 🎉 DONE!

Your URL Shortener is now **LIVE**! 

Share your frontend URL with friends and it should work perfectly.

For more details, see `DEPLOYMENT_GUIDE.md`
