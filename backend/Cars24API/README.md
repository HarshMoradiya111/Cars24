# Cars24 API Documentation

## 🔧 Backend REST API

**This folder contains the backend REST API built with ASP.NET Core and MongoDB.**

This API serves as the data layer for the **Next.js frontend** (`../../frontend/cars24/`), providing endpoints for:
- Car data management and retrieval
- User authentication and profiles
- Booking and appointment operations

---

## 📌 Backend API Boundary

**Role**: Data layer and business logic  
**Consumed by**: Frontend application (`../../frontend/cars24/`) via HTTP REST API calls  
**Key responsibilities**:
- Providing RESTful API endpoints for frontend operations
- Managing MongoDB database and data persistence
- Implementing business logic and validation
- Handling authentication and authorization
- Serving structured JSON responses to the frontend

**Related folders**:
- Frontend application: `../../frontend/cars24/`
- Frontend documentation: `../../frontend/cars24/README.md`

---
- Business logic and data persistence

The frontend communicates with this API via HTTP requests to manage all application data.

---

ASP.NET Core 9.0 REST API for the Cars24 platform.

## Base URL

Development: `http://localhost:5000`
Production: `https://cars-24-clone-net-nextjs.onrender.com`

## Setup

1. Install .NET SDK 9.0
2. Configure MongoDB connection in `appsettings.json` or `.env` file
3. Run: `dotnet run`

## Environment Variables

Create a `.env` file:

```
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
MONGODB_DATABASE_NAME=Cars24DB
```

## API Endpoints

### 🚗 Cars

#### Get All Cars (Summary)
```http
GET /api/Car/summaries
```

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "km": "string",
    "fuel": "string",
    "transmission": "string",
    "owner": "string",
    "emi": "string",
    "price": "string",
    "location": "string",
    "image": ["string"]
  }
]
```

#### Get Car by ID
```http
GET /api/Car/{id}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "images": ["string"],
  "price": "string",
  "emi": "string",
  "location": "string",
  "specs": {
    "year": 2024,
    "km": "string",
    "fuel": "string",
    "transmission": "string",
    "owner": "string",
    "insurance": "string"
  },
  "features": ["string"],
  "highlights": ["string"]
}
```

#### Create Car Listing
```http
POST /api/Car
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string",
  "images": ["string"],
  "price": "string",
  "emi": "string",
  "location": "string",
  "specs": {
    "year": 2024,
    "km": "string",
    "fuel": "string",
    "transmission": "string",
    "owner": "string",
    "insurance": "string"
  },
  "features": ["string"],
  "highlights": ["string"]
}
```

### 👤 User Authentication

#### Signup
```http
POST /api/UserAuth/signup
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phone": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string"
  }
}
```

#### Login
```http
POST /api/UserAuth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string"
  }
}
```

### 📅 Appointments

#### Create Appointment
```http
POST /api/Appointment?userId={userId}
Content-Type: application/json
```

**Request Body:**
```json
{
  "carId": "string",
  "carTitle": "string",
  "appointmentDate": "2024-01-22T10:00:00Z",
  "appointmentTime": "string",
  "status": "Pending"
}
```

#### Get User Appointments
```http
GET /api/Appointment/user/{userId}/appointments
```

#### Get Appointment by ID
```http
GET /api/Appointment/{id}
```

### 📦 Bookings

#### Create Booking
```http
POST /api/Booking?userId={userId}
Content-Type: application/json
```

**Request Body:**
```json
{
  "carId": "string",
  "carTitle": "string",
  "price": "string",
  "status": "Pending",
  "bookingDate": "2024-01-22T10:00:00Z"
}
```

#### Get User Bookings
```http
GET /api/Booking/user/{userId}/bookings
```

#### Get Booking by ID
```http
GET /api/Booking/{id}
```

## CORS Configuration

The API is configured to allow all origins in development. For production, update the CORS policy in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("https://your-frontend-domain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Database Schema

### Car Model
```csharp
{
  Id: string,
  Title: string,
  Images: string[],
  Price: string,
  Emi: string,
  Location: string,
  Specs: {
    Year: int,
    Km: string,
    Fuel: string,
    Transmission: string,
    Owner: string,
    Insurance: string
  },
  Features: string[],
  Highlights: string[]
}
```

### User Model
```csharp
{
  Id: string,
  Email: string,
  Password: string, // Hashed
  FullName: string,
  Phone: string,
  CreatedAt: DateTime
}
```

### Booking Model
```csharp
{
  Id: string,
  UserId: string,
  CarId: string,
  CarTitle: string,
  Price: string,
  Status: string,
  BookingDate: DateTime,
  CreatedAt: DateTime
}
```

### Appointment Model
```csharp
{
  Id: string,
  UserId: string,
  CarId: string,
  CarTitle: string,
  AppointmentDate: DateTime,
  AppointmentTime: string,
  Status: string,
  CreatedAt: DateTime
}
```

## Testing

Test the API using the included `Cars24API.http` file with REST Client extension in VS Code, or use tools like Postman.

## Deployment

1. Build: `dotnet publish -c Release`
2. Deploy to your hosting platform (Azure, AWS, etc.)
3. Set environment variables in your hosting platform
4. Ensure MongoDB connection is accessible

---

For more information, visit the [main repository README](../README.md).
