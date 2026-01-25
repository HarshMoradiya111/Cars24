Watch live Website 
https://cars24-i1k7y1v4l-harsh-moradiyas-projects.vercel.app/


# 🚗 CARS24 - Used Car Marketplace

A modern fullstack application for buying, selling, and managing used cars online.

---

## 🎯 Quick Start

### What You Need
- Node.js (for frontend)
- .NET (for backend)
- Git

### Get Running in 2 Minutes

**Terminal 1 - Start Backend:**
```bash
cd Cars24/backend/Cars24API
dotnet run
```
Backend will run on `http://localhost:5203`

**Terminal 2 - Start Frontend:**
```bash
cd Cars24/frontend/cars24
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

Visit `http://localhost:3000` in your browser! 🎉

---

## 📁 Project Layout

```
Cars24/
├── frontend/cars24/          👈 User Interface (Next.js + React)
│   ├── src/pages/            📄 Web pages (home, buy, sell, etc)
│   ├── src/components/       🧩 Reusable UI pieces
│   ├── src/lib/              🔧 Utilities & API connections
│   └── public/               🎨 Images & static files
│
├── backend/Cars24API/        👈 Server & Database (ASP.NET)
│   ├── Controllers/          🛣️ API routes
│   ├── Models/               📊 Data structures
│   ├── Services/             ⚙️ Business logic
│   └── appsettings.json      ⚙️ Configuration
│
└── README.md                 📖 This file
```

---

## 🏗️ How It Works

```
Your Browser (Frontend)
        ↓ You click something
  Next.js App Loads
        ↓ Needs car data?
  Sends Request
        ↓ (HTTP)
  Backend API
        ↓ Fetches from
  MongoDB Database
        ↓ Sends back
  Frontend Shows Results
```

**Frontend** = What you see & interact with  
**Backend** = Behind-the-scenes server & database

---

## 🌟 Cool Features

### 🚗 Buy & Sell Cars
- Browse available cars with detailed specs
- Filter by price, brand, location
- Book appointments for test drives
- Instant price estimation

### 💰 Maintenance Calculator
- Estimate maintenance costs for any car
- Brand-specific pricing (Maruti, Honda, BMW, etc)
- Interactive cost breakdown
- Located in: `frontend/cars24/src/components/Home/MaintenanceCalculator.tsx`

### � Dynamic Pricing Engine
- **Rule-based price recommendations** based on market conditions
- **Seasonal multipliers**: SUVs gain value in monsoon; hatchbacks peak in summer
- **Regional adjustments**: Metro, Hilly, and Rural pricing variations
- **Car type analysis**: Different cars perform differently in different seasons/regions
- Shows both Base Price and Recommended Price on all car listings
- Example: "SUV demand increases during monsoon in hilly regions"
- Located in: `frontend/cars24/src/lib/pricingEngine.ts`

#### How It Works
1. **Select Region**: Choose Metro, Hilly, or Rural from the filter panel
2. **Dynamic Calculation**: Prices auto-adjust based on:
   - Current season (detected automatically)
   - Selected region
   - Car type (SUV, Sedan, Hatchback, etc.)
3. **Explanation Provided**: Each car shows why its recommended price differs from base price

#### Examples
- **SUV in Hilly Region during Monsoon**: +20% (high demand for off-road capability)
- **Hatchback in Metro**: +10% (compact cars preferred in cities)
- **Coupe in Rural Area**: -20% (low demand for sports cars outside metros)

### �🔔 Smart Notifications
- Get notified when prices drop
- Appointment reminders
- New car listings alerts
- Push notifications via Firebase
- Located in: `frontend/cars24/src/lib/`

---

## 🛠️ Configuration

### Frontend Setup (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5203/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-key-here
```

### Backend Setup (`appsettings.json`)
```
MongoDB connection string
API port: 5203
```

---

## 📚 Technology Stack

| Layer | Tech | Version |
|-------|------|---------|
| **Frontend** | Next.js | 15 |
| | React | 19 |
| | Tailwind CSS | Latest |
| **Backend** | ASP.NET Core | 9 |
| | C# | Latest |
| **Database** | MongoDB | Latest |
| **Notifications** | Firebase | v12.8.0 |

---

## 🚀 Deployment

Ready to go live?

**Frontend:** Deploy on Vercel, Netlify, or Render  
**Backend:** Deploy on Azure, Heroku, or Render  

Just set your environment variables and you're good! 🎉

---

## 📖 Need More Info?

- **Frontend Details:** See `frontend/cars24/README.md`
- **Backend Details:** See `backend/Cars24API/README.md`
- **Project Setup:** See `SETUP_GUIDE.md`

---

## 💡 Pro Tips

✅ Always start backend first, then frontend  
✅ Check both terminals for errors  
✅ Database must be running (MongoDB)  
✅ Use `.env.local` for sensitive info  

---

## 👤 Built By

[Harsh Moradiya](https://github.com/HarshMoradiya111)

---

**Happy coding! 🚀**
