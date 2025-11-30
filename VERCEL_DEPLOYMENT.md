# Women Empowerment Resource Portal - Deployment to Vercel

## Quick Start Deploy

### Prerequisites
- Vercel account (free at https://vercel.com)
- MongoDB Atlas (free cluster at https://www.mongodb.com/cloud/atlas)
- GitHub repository with code pushed

### Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with strong password
4. Whitelist all IPs (0.0.0.0/0) for Vercel
5. Get connection string from "Connect" button

### Step 2: Deploy to Vercel

#### Option 1: Using GitHub (Recommended - Automatic Deployments)

1. Go to https://vercel.com
2. Click "New Project"
3. Connect your GitHub account (if not already done)
4. Select `women-empowerment-resource-portal` repository
5. In Build & Output Settings:
   - **Framework Preset:** Next.js (then change to Custom)
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install`

6. Add Environment Variables in "Environment Variables" section:
```
MONGODB_URI = mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET = your_jwt_secret_key_here_make_it_strong
ACCESS_TOKEN_SECRET = your_access_token_secret_here_make_it_strong
REFRESH_TOKEN_SECRET = your_refresh_token_secret_here_make_it_strong
NODE_ENV = production
```

7. Click "Deploy"

#### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Follow prompts and enter environment variables
```

### Step 3: Configure Environment Variables

After deployment, if you need to add or update environment variables:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `ACCESS_TOKEN_SECRET` - Secret for access tokens
   - `REFRESH_TOKEN_SECRET` - Secret for refresh tokens
   - `NODE_ENV` - Set to `production`

### Step 4: Verify Deployment

After deployment, test:

1. **Homepage:** https://your-project.vercel.app
2. **API:** https://your-project.vercel.app/api/users (should fail gracefully if no users)
3. **Navigation:** Click through different pages
4. **Database:** Check MongoDB Atlas for connections

## Project Structure for Vercel

```
women-empowerment-resource-portal/
├── backend/              # Express.js API Server
│   ├── server.js
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   ├── middleware/       # Auth & other middleware
│   ├── config/
│   ├── package.json
│   └── .env             # Production secrets from Vercel
│
├── frontend/             # React/Vite Frontend App
│   ├── src/
│   ├── vite.config.ts
│   ├── package.json
│   └── dist/            # Built files (production)
│
├── vercel.json          # Vercel deployment config
├── .nvmrc               # Node version (18.17.0)
└── package.json         # Root workspace
```

## Deployment Config (vercel.json)

The `vercel.json` file handles:
- **Frontend:** Static Vite build deployed to Vercel's CDN
- **Backend:** Express.js server running on Vercel Functions
- **Routing:** All `/api/*` requests go to backend, others to frontend

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your_random_string_here` |
| `ACCESS_TOKEN_SECRET` | Secret for access tokens | `another_random_string` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | `yet_another_random_string` |
| `NODE_ENV` | Environment type | `production` |

## MongoDB Atlas Configuration for Vercel

### Network Access

1. Go to MongoDB Atlas Dashboard
2. Click "Security" → "Network Access"
3. Click "Add IP Address"
4. Add `0.0.0.0/0` to allow Vercel IPs
   - *Note: For production, it's safer to use Vercel's IP range*

### Connection String

1. Click "Databases" → your cluster
2. Click "Connect"
3. Choose "Drivers"
4. Copy the MongoDB URI
5. Replace `<username>` and `<password>` with your database user credentials

Example:
```
mongodb+srv://admin:myPassword123@cluster.mongodb.net/women_empowerment?retryWrites=true&w=majority
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard (Deployments tab)
- Ensure all dependencies are in `package.json`
- Verify no TypeScript errors: `npm run lint`

### API Calls Fail
- Verify `MONGODB_URI` environment variable is set
- Check MongoDB IP whitelist includes Vercel
- Check browser DevTools Network tab for error details

### Database Connection Errors
- Verify MongoDB cluster is running
- Check credentials in `MONGODB_URI`
- Test connection locally first: `mongodb+srv://user:password@cluster.mongodb.net/db`

### Frontend Blank Page
- Check browser console for errors (F12)
- Verify `VITE_API_URL` is set correctly
- Check Vercel build logs for errors

## Redeployment

After pushing changes to GitHub:
- **With GitHub Integration:** Automatic redeploy on push to main
- **Manual Redeploy:** `vercel --prod` from command line

## Monitoring

After deployment, monitor:

1. **Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Check deployment status
   - View analytics and logs

2. **MongoDB Atlas:**
   - Check connection activity
   - Monitor performance
   - Review database size

## Cost Considerations

### Vercel
- **Frontend:** Free tier includes 100 GB bandwidth
- **Backend:** Vercel Functions have generous free limits
- **Pricing:** Pay-as-you-go after free limits

### MongoDB Atlas
- **Free Tier:** M0 cluster (512 MB storage)
- **Production:** M2+ clusters ($0.54/day minimum)

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] MongoDB Atlas cluster running
- [ ] Network access allows Vercel IPs
- [ ] Frontend builds successfully
- [ ] Backend API tests pass
- [ ] Email/SMS notifications (if configured) working
- [ ] Rate limiting configured (if needed)
- [ ] Error logging setup (Vercel provides this)
- [ ] Performance monitoring (optional: New Relic, Datadog)

## Support & Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated:** November 30, 2025
