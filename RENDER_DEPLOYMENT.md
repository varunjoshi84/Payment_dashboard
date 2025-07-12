# Deploy Backend to Render

This guide explains how to deploy the Payment Dashboard backend to Render.

## 📋 Prerequisites

1. **GitHub Repository** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - For production database (recommended)

## 🗄️ Step 1: Setup MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/payment_dashboard
   ```
4. Save this connection string for later

## 🚀 Step 2: Deploy to Render

### 2.1 Create New Web Service

1. Login to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/varunjoshi84/Payment_dashboard.git`
4. Select the repository from the list

### 2.2 Configure Service Settings

Fill in the following settings:

**Basic Settings:**
- **Name**: `payment-dashboard-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 2.3 Set Environment Variables

In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default) |
| `JWT_SECRET` | `your-super-secret-jwt-key-for-production-change-this` |
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/payment_dashboard` |

**⚠️ Important:** Replace the MongoDB URI with your actual Atlas connection string!

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy your app
3. Wait for the build to complete (usually 2-5 minutes)

## 🔗 Step 3: Get Your API URL

After deployment, you'll get a URL like:
```
https://payment-dashboard-backend.onrender.com
```

Your API endpoints will be available at:
- Health check: `https://your-app.onrender.com/api`
- Login: `https://your-app.onrender.com/api/auth/login`
- Payments: `https://your-app.onrender.com/api/payments`

## 🧪 Step 4: Test Your Deployed API

Test with curl or Postman:

```bash
# Health check
curl https://your-app.onrender.com/api

# Login (use your registered credentials)
curl -X POST https://your-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'
```

## 📱 Step 5: Update Frontend

Update your Flutter app to use the production API URL:

In `frontend/lib/services/api_service.dart`:
```dart
class ApiService {
  static const String baseUrl = 'https://your-app.onrender.com/api';
  // ... rest of your code
}
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compiles locally: `npm run build`

2. **App Crashes on Start**:
   - Check application logs in Render dashboard
   - Verify environment variables are set correctly
   - Ensure MongoDB connection string is correct

3. **CORS Errors**:
   - Update CORS origin in your backend code
   - Add your frontend domain to allowed origins

4. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check Atlas network access settings
   - Ensure database user has correct permissions

## 💡 Pro Tips

1. **Free Tier Limitations**:
   - Render free tier sleeps after 15 minutes of inactivity
   - First request after sleep takes 30+ seconds to wake up
   - Consider upgrading for production use

2. **Environment Variables**:
   - Use strong, unique JWT secrets for production
   - Never commit sensitive data to GitHub

3. **Monitoring**:
   - Check Render dashboard for logs and metrics
   - Set up alerts for downtime

## 🔄 Updates

To update your deployed app:
1. Push changes to GitHub
2. Render will automatically redeploy
3. Monitor deployment in Render dashboard

---

**Your Payment Dashboard backend is now live on Render! 🎉**
