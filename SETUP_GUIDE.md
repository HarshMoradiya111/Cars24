# 🚀 Complete Setup Guide for Cars24 Platform

This guide will help you set up the complete Cars24 platform from scratch.

## 📋 What You'll Need

- **Node.js** 20 or higher ([Download](https://nodejs.org/))
- **.NET SDK 9.0** ([Download](https://dotnet.microsoft.com/download))
- **MongoDB Atlas** account (free tier) or local MongoDB
- **Git** for version control
- **VS Code** or your preferred IDE

## 🛠️ Step-by-Step Setup

### Step 1: MongoDB Setup

1. **Create MongoDB Atlas Account** (if using cloud)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new cluster (M0 free tier is fine)
   - Wait for cluster to provision (2-3 minutes)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

3. **Create Database**
   - Click "Collections"
   - Create database named: `Cars24DB`
   - Create collections: `cars`, `users`, `bookings`, `appointments`

### Step 2: Backend Setup (.NET API)

1. **Navigate to API folder**
   ```bash
   cd cars24-main/cars24-main/Cars24API
   ```

2. **Create `.env` file** (or update `appsettings.json`)
   
   Create a file named `.env`:
   ```env
   MONGODB_CONNECTION_STRING=your_mongodb_connection_string_here
   MONGODB_DATABASE_NAME=Cars24DB
   ```

   OR update `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "Cars24DB": "your_mongodb_connection_string_here"
     },
     "MongoDB": {
       "DatabaseName": "Cars24DB"
     }
   }
   ```

3. **Install dependencies and run**
   ```bash
   dotnet restore
   dotnet run
   ```

4. **Verify API is running**
   - Open browser: `http://localhost:5000`
   - You should see: "Welcome to Cars24 API"
   - Test DB: `http://localhost:5000/db-check`

### Step 3: Frontend Setup (Next.js)

1. **Navigate to frontend folder**
   ```bash
   cd ../cars24
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Create `.env.local` file**
   
   Create a file named `.env.local`:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # Optional: Cloudinary for image uploads (get free account at cloudinary.com)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   - Navigate to: `http://localhost:3000`
   - You should see the Cars24 homepage

### Step 4: Optional - Cloudinary Setup (for image uploads)

1. **Create Cloudinary account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Sign up for free account

2. **Get credentials**
   - Go to Dashboard
   - Copy "Cloud Name"
   - Go to Settings > Upload
   - Create an "Upload Preset" (set to "Unsigned")
   - Copy the preset name

3. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

## ✅ Verification Checklist

Run through this checklist to ensure everything is working:

### Backend Checks
- [ ] API runs without errors: `http://localhost:5000`
- [ ] Database connection successful: `http://localhost:5000/db-check`
- [ ] Can access Swagger/OpenAPI docs (if enabled)
- [ ] CORS is properly configured

### Frontend Checks
- [ ] Homepage loads: `http://localhost:3000`
- [ ] Navigation menu works
- [ ] Can navigate to all pages:
  - [ ] `/buy-car` - Buy cars page
  - [ ] `/sell-car` - Sell car form
  - [ ] `/finance` - Finance/EMI calculator
  - [ ] `/new-cars` - New cars listing
  - [ ] `/services` - Car services
  - [ ] `/login` - Login page
  - [ ] `/signup` - Signup page

### Functionality Checks
- [ ] User can sign up
- [ ] User can login
- [ ] User can browse cars
- [ ] Can view car details (click on a car)
- [ ] Can navigate through sell car multi-step form
- [ ] EMI calculator works on finance page

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check your connection string is correct
- Ensure IP address is whitelisted in MongoDB Atlas (Network Access)
- Check username/password are correct

### Issue: "API not found" or CORS errors
**Solution:**
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is configured in `Program.cs`

### Issue: "Module not found" in frontend
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use
**Solution:**
```bash
# For backend (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For frontend (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# For backend (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# For frontend (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

## 🎯 Quick Start Commands

### Start Both Services (2 terminals)

**Terminal 1 - Backend:**
```bash
cd cars24-main/cars24-main/Cars24API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd cars24-main/cars24-main/cars24
npm run dev
```

### One-Command Start (if you prefer)

Create a script file:

**start-dev.bat** (Windows):
```batch
@echo off
start cmd /k "cd Cars24API && dotnet run"
start cmd /k "cd cars24 && npm run dev"
```

**start-dev.sh** (Mac/Linux):
```bash
#!/bin/bash
cd Cars24API && dotnet run &
cd cars24 && npm run dev &
```

## 📦 Production Deployment

### Backend Deployment
```bash
cd Cars24API
dotnet publish -c Release -o ./publish
```

Deploy the `./publish` folder to:
- Azure App Service
- AWS Elastic Beanstalk
- Heroku
- Render.com

### Frontend Deployment
```bash
cd cars24
npm run build
```

Deploy to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Azure Static Web Apps

## 🔒 Production Security Checklist

Before deploying to production:
- [ ] Change all default passwords
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS (not AllowAll)
- [ ] Add rate limiting
- [ ] Implement proper authentication/JWT
- [ ] Add input validation
- [ ] Set up monitoring and logging
- [ ] Backup database regularly
- [ ] Use .gitignore to exclude sensitive files

## 📞 Need Help?

- Check the main [README.md](../README.md)
- Check the [API Documentation](Cars24API/README.md)
- Open an issue on GitHub
- Review the code comments

---

**Happy Coding! 🚗💨**
