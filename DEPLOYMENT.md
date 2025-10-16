# Car Recommendation System - Deployment Guide

## 🚨 Important: GitHub Pages Limitation

**GitHub Pages only supports static websites** (HTML, CSS, JavaScript frontend only). It cannot run:
- Node.js servers
- MySQL databases  
- Backend APIs

## 📋 Deployment Options

### Option 1: Static Version on GitHub Pages ✅

**What you get:**
- Beautiful UI with Tailwind CSS
- Interactive budget slider
- Static car data (6 sample cars)
- Client-side filtering
- Works on GitHub Pages

**Steps:**
1. Create a new GitHub repository
2. Upload `index_static.html` as `index.html`
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://yourusername.github.io/repository-name`

**Files needed:**
- `index_static.html` (rename to `index.html`)

### Option 2: Full Stack Deployment 🌐

**For the complete application with Node.js + MySQL:**

#### Recommended Platforms:
1. **Heroku** (Free tier available)
2. **Railway** (Modern, easy setup)
3. **Render** (Good free tier)
4. **DigitalOcean App Platform**
5. **AWS EC2** (More complex)

#### Required Changes for Cloud Deployment:

1. **Environment Variables:**
```javascript
// server.js - Update database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'prasanna',
  password: process.env.DB_PASSWORD || '0462',
  database: process.env.DB_NAME || 'car_recommendation'
});
```

2. **Package.json Scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'"
  }
}
```

3. **Procfile** (for Heroku):
```
web: node server.js
```

4. **Database Setup:**
- Use cloud MySQL (PlanetScale, AWS RDS, etc.)
- Or use PostgreSQL (more common on cloud platforms)

## 🚀 Quick GitHub Pages Setup

1. **Create GitHub Repository:**
   ```bash
   git init
   git add index_static.html
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/car-recommendation.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Your site will be live at `https://yourusername.github.io/car-recommendation`

## 🔧 Full Stack Deployment (Railway Example)

1. **Prepare for Railway:**
   ```bash
   # Create railway.json
   echo '{"build": {"builder": "NIXPACKS"}}' > railway.json
   
   # Update server.js for production
   const PORT = process.env.PORT || 3000;
   ```

2. **Database Migration:**
   - Use Railway PostgreSQL addon
   - Convert MySQL schema to PostgreSQL
   - Update connection string

3. **Deploy:**
   - Connect GitHub repo to Railway
   - Add environment variables
   - Deploy automatically

## 📊 Comparison

| Feature | GitHub Pages | Full Stack |
|---------|--------------|------------|
| Cost | Free | $5-20/month |
| Database | ❌ Static data | ✅ MySQL/PostgreSQL |
| Real-time | ❌ | ✅ |
| Scalability | Limited | High |
| Setup Time | 5 minutes | 30+ minutes |

## 🎯 Recommendation

**For Portfolio/Demo:** Use GitHub Pages with static version
**For Production:** Use Railway/Render with full stack

## 📁 Files for GitHub Pages

- `index_static.html` → Rename to `index.html`
- That's it! No other files needed.

## 📁 Files for Full Stack Deployment

- All current files
- Updated `server.js` with environment variables
- `railway.json` or `Procfile`
- Database migration scripts
