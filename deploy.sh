#!/bin/bash
# Quick Vercel Deployment Script

echo "🚀 Preparing for Vercel Deployment..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Login to Vercel (if not already logged in)
echo "🔐 Logging into Vercel..."
vercel login

# Deploy
echo "📤 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Vercel dashboard:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - ACCESS_TOKEN_SECRET"
echo "   - REFRESH_TOKEN_SECRET"
echo ""
echo "2. Verify deployment at your Vercel project URL"
echo ""
echo "📚 For detailed instructions, see VERCEL_DEPLOYMENT.md"
