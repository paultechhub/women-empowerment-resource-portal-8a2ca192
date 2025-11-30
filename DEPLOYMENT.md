# Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with your code pushed
- MongoDB Atlas account (for remote database)

## Step 1: Prepare for Deployment

### 1.1 Update Environment Configuration

For production, you'll need to update the API URLs. Create a production environment file:

**frontend/.env.production**
```
VITE_API_URL=https://your-domain.vercel.app/api
```

### 1.2 Verify Build Scripts

Backend:
- Ensure `backend/package.json` has all required dependencies
- Check that `.env` variables are set in Vercel

Frontend:
- Ensure `frontend/package.json` has `build` script (vite build)
- Check `vite.config.ts` output directory is `dist`

## Step 2: Deploy on Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

### Option B: Using GitHub Integration

1. Go to https://vercel.com
2. Click "New Project"
3. Connect your GitHub account
4. Select the repository
5. Configure build settings:
   - **Framework:** Vite (for frontend detection)
   - **Root Directory:** (leave blank)
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`

## Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db_name
JWT_SECRET=your_jwt_secret_key_here
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=production
```

## Step 4: Configure MongoDB for Production

1. Create a MongoDB Atlas cluster (if not already done)
2. Set up IP Whitelist to allow Vercel IPs:
   - Add `0.0.0.0/0` (allows all IPs) - for development
   - Or configure specific Vercel IPs for production

3. Get connection string from MongoDB Atlas
4. Add to Vercel environment variables as `MONGODB_URI`

## Step 5: Testing Deployment

After deployment, test the following:

1. **Frontend loads:**
   - https://your-project.vercel.app/

2. **API responds:**
   - https://your-project.vercel.app/api/users

3. **Routes work:**
   - https://your-project.vercel.app/courses
   - https://your-project.vercel.app/auth

## Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Verify all dependencies are in package.json
3. Check for hardcoded localhost URLs (should use relative paths)

### API Calls Fail

1. Verify `MONGODB_URI` is set correctly
2. Check MongoDB IP whitelist includes Vercel IPs
3. Verify API proxy routes in `vercel.json`

### Database Connection Issues

1. Ensure MongoDB cluster is running
2. Check connection string syntax
3. Verify credentials in environment variables

## Local Testing Before Deployment

```bash
# Build locally
npm run build:frontend

# Test production build
cd frontend
npm run preview
```

## Project Structure for Vercel

```
project-root/
├── backend/           # Express API
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── package.json
├── frontend/          # React/Vite App
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
├── vercel.json        # Deployment config
├── .nvmrc             # Node version
└── package.json       # Root workspace config
```

## Redeployment

To redeploy after code changes:

1. Commit changes to GitHub
2. Push to main branch
3. Vercel automatically redeploys (if using GitHub integration)

Or manually:
```bash
vercel --prod
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/next-js) (reference)
- [MongoDB Atlas Vercel Integration](https://www.mongodb.com/docs/cloud/atlas/)
