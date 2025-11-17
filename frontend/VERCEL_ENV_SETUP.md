# Vercel Environment Variables Setup

## CORS Error Fix

Your frontend is trying to access `http://localhost:3000` instead of your Render backend. This happens because the environment variables aren't set in Vercel.

## Step 1: Get Your Render Backend URL

1. Go to your Render dashboard
2. Find your backend service
3. Copy the URL (e.g., `https://your-app-backend.onrender.com`)

## Step 2: Set Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add these variables:

```
VITE_RENDER_BACKEND_URL=https://your-app-backend.onrender.com
```

### Method 2: Vercel CLI
```bash
vercel env add VITE_RENDER_BACKEND_URL
# Enter: https://your-app-backend.onrender.com
```

## Step 3: Redeploy Frontend

After setting environment variables:
1. Go to Vercel dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger redeploy

## Step 4: Verify Configuration

1. Open your deployed frontend
2. Open browser developer tools (F12)
3. Check console logs - you should see:
   ```
   🌐 API Base URL: https://your-app-backend.onrender.com/api
   🔌 Socket URL: https://your-app-backend.onrender.com
   ```

## Alternative: Direct API URLs

If you prefer to set direct API URLs:

```
VITE_API_BASE_URL=https://your-app-backend.onrender.com/api
VITE_SOCKET_URL=https://your-app-backend.onrender.com
```

## Troubleshooting

### Still getting CORS errors?
1. **Check backend CORS configuration**
   - Ensure your Render backend has the Vercel frontend URL in CORS origins
   - Add this to your Render environment variables:
     ```
     ALLOWED_ORIGINS=https://capstonev1.vercel.app
     VERCEL_FRONTEND_URL=https://capstonev1.vercel.app
     ```

2. **Verify environment variables**
   - Check Vercel dashboard that variables are set
   - Ensure no typos in variable names
   - Variables must start with `VITE_`

3. **Check browser console**
   - Look for the debug logs showing which URLs are being used
   - Verify the API Base URL is not localhost

### Backend not responding?
1. **Check Render service status**
   - Go to Render dashboard
   - Ensure service is running
   - Check logs for errors

2. **Test backend directly**
   - Visit: `https://your-app-backend.onrender.com/api/services`
   - Should return JSON data

## Quick Fix Commands

```bash
# Set environment variable via Vercel CLI
vercel env add VITE_RENDER_BACKEND_URL

# Redeploy
vercel --prod
```

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_RENDER_BACKEND_URL` | `https://your-app.onrender.com` | Your Render backend URL |
| `VITE_API_BASE_URL` | `https://your-app.onrender.com/api` | Direct API URL (alternative) |
| `VITE_SOCKET_URL` | `https://your-app.onrender.com` | Socket connection URL (alternative) |

After setting these variables and redeploying, your CORS error should be resolved! 🚀






