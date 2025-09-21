# Deployment Guide

## Live URLs
- **Frontend**: https://pro-1-64xr.onrender.com
- **Backend**: https://pro-baww.onrender.com

## Configuration Changes Made

### 1. API Configuration Updated
- **File**: `client/src/services/api.js`
- **Change**: Updated API_BASE_URL to use live backend
- **From**: `http://localhost:3000/api`
- **To**: `https://pro-baww.onrender.com/api`

### 2. Environment Variables
- **File**: `client/.env`
- **Content**: `VITE_API_BASE_URL=https://pro-baww.onrender.com/api`

## Deployment Steps

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository to Vercel or Netlify
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add environment variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `PORT`: 10000 (or let Render assign)

## Environment Variables for Production

### Frontend (.env)
```
VITE_API_BASE_URL=https://pro-baww.onrender.com/api
```

### Backend (.env)
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/company-reviews
PORT=10000
```

## Testing Live URLs

### Backend API Endpoints
- Health Check: https://pro-baww.onrender.com/api/health
- Companies: https://pro-baww.onrender.com/api/companies
- Reviews: https://pro-baww.onrender.com/api/reviews

### Frontend
- Main App: https://pro-1-64xr.onrender.com

## Build Output
The production build is ready in the `dist/` folder with:
- Optimized JavaScript bundle
- Minified CSS
- Compressed assets
- Environment variables configured

## Notes
- All API calls now point to the live backend
- CORS is configured for cross-origin requests
- MongoDB connection uses Atlas for production
- All hardcoded localhost URLs have been replaced
