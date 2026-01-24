# 🚀 Cars24 Quick Reference Card

## ⚡ Quick Start (Copy & Paste)

### Start Backend
```bash
cd e:\vs\cars24-main\cars24-main\Cars24API
dotnet run
```
**URL:** http://localhost:5000

### Start Frontend
```bash
cd e:\vs\cars24-main\cars24-main\cars24
npm run dev
```
**URL:** http://localhost:3000

---

## 📋 Essential URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main website |
| Backend | http://localhost:5000 | API server |
| DB Check | http://localhost:5000/db-check | Test MongoDB |

---

## 📁 Key Files Location

### Frontend
```
cars24/
├── .env.local                           # ⚙️ Config (API URL, Cloudinary)
├── src/pages/                           # 📄 All pages
├── src/components/                      # 🧩 Reusable components
├── src/lib/                             # 🔌 API clients
└── src/context/AuthContext.tsx          # 🔐 Authentication
```

### Backend
```
Cars24API/
├── .env or appsettings.json             # ⚙️ Config (MongoDB)
├── Controllers/                         # 🎮 API endpoints
├── Models/                              # 📊 Data models
└── Services/                            # 💼 Business logic
```

---

## 🎯 All Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/buy-car` | Browse cars |
| `/buy-car/[id]` | Car details |
| `/sell-car` | Sell your car |
| `/finance` | EMI calculator |
| `/new-cars` | New car listings |
| `/services` | Car services |
| `/login` | User login |
| `/signup` | User registration |
| `/profile` | User dashboard |
| `/appointments` | Test drives |
| `/bookings` | Car bookings |

---

## 🔑 API Endpoints

### Cars
- `GET /api/Car/summaries` - List all cars
- `GET /api/Car/{id}` - Get car details
- `POST /api/Car` - Create listing

### Users
- `POST /api/UserAuth/signup` - Register
- `POST /api/UserAuth/login` - Login
- `GET /api/UserAuth/{id}` - Get user

### Bookings
- `POST /api/Booking?userId={id}` - Create
- `GET /api/Booking/user/{userId}/bookings` - Get all

### Appointments
- `POST /api/Appointment?userId={id}` - Create
- `GET /api/Appointment/user/{userId}/appointments` - Get all

---

## ⚙️ Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Backend (`.env`)
```env
MONGODB_CONNECTION_STRING=mongodb+srv://...
MONGODB_DATABASE_NAME=Cars24DB
```

---

## 🐛 Troubleshooting Commands

### Clear Cache & Reinstall
```bash
# Frontend
cd cars24
rm -rf node_modules package-lock.json
npm install

# Backend
cd Cars24API
dotnet clean
dotnet restore
```

### Kill Port Process
```powershell
# Windows PowerShell
# Kill port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Kill port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Check Logs
```bash
# Frontend - Terminal output
# Backend - Terminal output
# MongoDB - Atlas dashboard
```

---

## 📦 Useful Commands

### Build for Production
```bash
# Frontend
cd cars24
npm run build
npm start

# Backend
cd Cars24API
dotnet publish -c Release
```

### Run Tests (if added)
```bash
# Frontend
npm test

# Backend
dotnet test
```

---

## 🔐 Default Test Data

Create test user via signup or use:
```json
{
  "email": "test@example.com",
  "password": "test123456",
  "fullName": "Test User",
  "phone": "1234567890"
}
```

---

## 📚 Documentation Files

1. **README.md** - Main overview
2. **SETUP_GUIDE.md** - Detailed setup
3. **COMPLETION_SUMMARY.md** - What's included
4. **Cars24API/README.md** - API docs
5. **THIS FILE** - Quick reference

---

## 🎯 Tech Stack at a Glance

**Frontend:** Next.js 15 + TypeScript + Tailwind  
**Backend:** .NET Core 9.0 + C#  
**Database:** MongoDB Atlas  
**UI:** Radix UI + Shadcn/ui  
**Auth:** Context API (JWT ready)  

---

## ✅ Pre-Flight Checklist

Before starting development:
- [ ] MongoDB connection string set
- [ ] `.env.local` created in frontend
- [ ] `.env` or `appsettings.json` updated in backend
- [ ] `npm install` completed
- [ ] `dotnet restore` completed
- [ ] Port 3000 and 5000 available

---

## 🆘 Quick Help

**Issue:** Can't connect to database  
**Fix:** Check MongoDB connection string and IP whitelist

**Issue:** CORS error  
**Fix:** Ensure backend is running and `NEXT_PUBLIC_API_URL` is correct

**Issue:** Page not found  
**Fix:** Check you're in the correct project folder (cars24-main/cars24-main/cars24)

**Issue:** Module not found  
**Fix:** Run `npm install` again

---

## 📞 Get Help

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review API docs in [Cars24API/README.md](Cars24API/README.md)
3. Check code comments
4. Review error messages in terminal

---

**Keep this file handy for daily development! 🚀**

*Quick Reference v1.0 - January 2026*
