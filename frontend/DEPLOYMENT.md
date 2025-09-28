# Deployment Guide - Centralized API Configuration

## Overview
The frontend now uses a centralized API configuration that automatically adapts to different environments (local development, Vercel, Render).

## Environment Variables

### For Vercel Deployment (Frontend)
Set these environment variables in your Vercel dashboard:

```bash
# Option 1: Direct API URL
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com

# Option 2: Using Render Backend URL (simpler)
VITE_RENDER_BACKEND_URL=https://your-backend.onrender.com
```

### For Local Development
Create a `.env.local` file in the frontend directory:

```bash
# Copy from env.example
cp env.example .env.local

# Edit .env.local with your values
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## Configuration Priority

The system checks for environment variables in this order:

1. **VITE_API_BASE_URL** - Direct API URL
2. **VITE_RENDER_BACKEND_URL** - Render backend URL (adds /api automatically)
3. **Development fallback** - localhost:3000 or network IP

## How It Works

### API Configuration (`src/config/api.js`)
- Automatically detects environment
- Uses environment variables for production
- Falls back to localhost for development
- Supports network IP detection for testing

### Vite Configuration (`vite.config.js`)
- Loads environment variables
- Configures proxy for development
- Supports multiple build modes

## Deployment Steps

### 1. Deploy Backend to Render
- Deploy your backend to Render
- Note the URL (e.g., `https://your-app.onrender.com`)

### 2. Configure Vercel Environment Variables
- Go to your Vercel project settings
- Add environment variables:
  ```
  VITE_RENDER_BACKEND_URL=https://your-app.onrender.com
  ```

### 3. Redeploy Frontend
- Trigger a new deployment in Vercel
- The frontend will automatically use the Render backend

## Testing

### Local Development
```bash
cd frontend
npm run dev
```
- Uses localhost:3000 by default
- Network IP detection still works

### Production Testing
- Check browser console for API URLs
- Verify API calls go to Render backend
- Test socket connections

## Troubleshooting

### API Calls Not Working
1. Check browser console for API URL
2. Verify environment variables in Vercel
3. Ensure backend is deployed and accessible

### Socket Connection Issues
1. Check SOCKET_URL in console
2. Verify WebSocket support on Render
3. Check CORS settings on backend

### Development Issues
1. Ensure backend is running on port 3000
2. Check network IP if testing on mobile
3. Verify proxy configuration in vite.config.js

## Benefits

✅ **No hardcoded URLs** - All URLs are configurable  
✅ **Environment-aware** - Automatically adapts to deployment  
✅ **Easy deployment** - Just set environment variables  
✅ **Backward compatible** - Existing code works unchanged  
✅ **Network testing** - Supports local network IP detection  
✅ **Production ready** - Works with Vercel and Render  

## Files Modified

- `src/config/api.js` - Centralized API configuration
- `vite.config.js` - Environment variable support
- `env.example` - Environment variable documentation
- `DEPLOYMENT.md` - This deployment guide

All 23 components already use the centralized configuration - no code changes needed!
