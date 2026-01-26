# Geo-Fencing Quick Start Guide

## 🚀 What's Been Implemented

A complete geo-fencing system with:
- **Auto-detection** of user's city via browser geolocation
- **Manual selection** via searchable dropdown
- **City-based filtering** of car listings
- **Service center locations** with embedded Google Maps
- **27 locations** across 8 major Indian cities

## 📁 Key Files

### Core Implementation
- **`src/context/LocationContext.tsx`** - Location state & geolocation logic
- **`src/components/CitySelector.tsx`** - City dropdown UI component
- **`src/components/LocationMap.tsx`** - Maps & service centers display

### Integration Points
- **`src/pages/_app.tsx`** - LocationProvider wrapper added
- **`src/components/Header.tsx`** - CitySelector in header & mobile menu
- **`src/pages/buy-car/index.tsx`** - City-based car filtering
- **`src/pages/locations/index.tsx`** - Dedicated locations page
- **`src/pages/index.tsx`** - LocationSection on homepage

## 🎯 How It Works

### For Users:
1. Visit site → Location auto-detected
2. If permission granted → City set automatically
3. If denied → Manual selection required
4. Browse cars → Filtered by selected city
5. View locations → See service centers on map

### For Developers:

#### Using Location in Components:
```tsx
import { useLocation } from '@/context/LocationContext';

function MyComponent() {
  const { 
    selectedCity,      // "Delhi" | "Mumbai" | etc.
    setSelectedCity,   // Function to change city
    cityData,          // Full city data with service centers
    isDetecting,       // Boolean: detection in progress
    detectLocation     // Function to trigger detection
  } = useLocation();

  return (
    <div>
      {selectedCity ? (
        <p>Showing results for {selectedCity}</p>
      ) : (
        <button onClick={detectLocation}>
          Detect My Location
        </button>
      )}
    </div>
  );
}
```

#### Filtering Data by City:
```tsx
const filteredCars = cars.filter(car => 
  !selectedCity || 
  car.location.toLowerCase().includes(selectedCity.toLowerCase())
);
```

## 🗺️ Available Cities

| City | Service Centers | Pickup Hubs |
|------|----------------|-------------|
| Delhi | 2 | 2 |
| Mumbai | 2 | 2 |
| Bangalore | 2 | 2 |
| Hyderabad | 1 | 2 |
| Pune | 1 | 2 |
| Chennai | 1 | 2 |
| Kolkata | 1 | 2 |
| Ahmedabad | 1 | 2 |

**Total: 27 locations**

## ⚙️ Configuration

### Required for Production:

1. **Google Maps API Key**  
   Edit `src/components/LocationMap.tsx`:
   ```tsx
   const apiKey = 'YOUR_ACTUAL_GOOGLE_MAPS_API_KEY';
   ```
   
   Get your key at: https://console.cloud.google.com/
   
   Enable these APIs:
   - Maps Embed API
   - Directions API

2. **HTTPS Required**  
   Browser geolocation only works on HTTPS in production

### Optional:
- OpenStreetMap Nominatim (already configured, free)

## 🧪 Testing

### Test Location Detection:
1. Open site in browser
2. Check browser console for geolocation prompt
3. Grant permission → City should auto-set
4. Deny permission → Error shown, manual selection enabled

### Test Filtering:
1. Select different cities from dropdown
2. Navigate to `/buy-car`
3. Verify cars are filtered by city
4. Check banner shows selected city

### Test Map:
1. Navigate to `/locations`
2. Select a city
3. Verify map shows correct city
4. Click "Get Directions" on any location
5. Verify Google Maps opens with correct coordinates

## 📱 Mobile Testing

CitySelector appears in:
- Desktop header (top right)
- Mobile menu (at top)

Test on:
- iOS Safari
- Chrome Mobile
- Firefox Mobile

## 🔧 Common Tasks

### Add a New City:
Edit `LocationContext.tsx`, add to `CITIES_DATA`:
```tsx
'CityName': {
  name: 'CityName',
  state: 'StateName',
  lat: 12.3456,
  lng: 78.9012,
  serviceCenters: [
    {
      id: 'city-1',
      name: 'CARS24 Hub Location',
      address: 'Full Address',
      phone: '+91-1234567890',
      lat: 12.3456,
      lng: 78.9012,
      type: 'pickup'  // or 'service'
    }
  ]
}
```

### Add More Locations to Existing City:
Find the city in `CITIES_DATA`, add to `serviceCenters` array.

### Customize Detection Behavior:
Edit `detectLocation()` function in `LocationContext.tsx`:
- Timeout: Change `timeout: 10000` (in ms)
- Accuracy: Change `enableHighAccuracy: true`

### Disable Auto-Detection:
Comment out in `LocationContext.tsx`:
```tsx
// useEffect(() => {
//   // Auto-detect on first load
//   detectLocation();
// }, []);
```

## 🐛 Troubleshooting

### Location Not Detecting:
- Check browser console for errors
- Verify HTTPS (required for geolocation)
- Check browser permissions (may be blocked)
- Try in incognito mode

### Map Not Showing:
- Verify Google Maps API key is set
- Check browser console for API errors
- Verify API key has correct APIs enabled
- Check for rate limits

### Cars Not Filtering:
- Verify car `location` field includes city name
- Check browser console for filter logs
- Ensure `selectedCity` is set (check console)

### City Not Persisting:
- Check localStorage in browser DevTools
- Look for `selectedCity` key
- Clear localStorage and retry

## 📊 Performance Notes

- **Initial load**: Single geolocation API call
- **Reverse geocoding**: Max 1 call (cached in state)
- **localStorage**: Prevents repeated detections
- **No backend calls**: Everything runs client-side

## 🎨 Customization

### Change City Selector Styling:
Edit `CitySelector.tsx`:
```tsx
// Main button
className="flex items-center gap-2 px-4 py-2 bg-white..."

// Dropdown
className="absolute top-full left-0 mt-2 w-80..."
```

### Change Map Display:
Edit `LocationMap.tsx`:
```tsx
// Map height
className="relative w-full h-96"  // Change h-96

// Default zoom
zoom=11  // Adjust zoom level (1-20)
```

### Change Service Center Icons:
Replace `<MapPin />` icons in:
- `LocationMap.tsx`
- `LocationSection.tsx`

## 📚 Learn More

- Full documentation: `GEO_FENCING_GUIDE.md`
- Implementation summary: `GEO_FENCING_SUMMARY.md`
- OpenStreetMap Nominatim: https://nominatim.org/
- Google Maps Platform: https://developers.google.com/maps

## ✅ Pre-Deployment Checklist

- [ ] Replace Google Maps API key
- [ ] Test on HTTPS
- [ ] Verify all 8 cities load correctly
- [ ] Test geolocation on mobile devices
- [ ] Check localStorage persistence
- [ ] Verify car filtering works
- [ ] Test "Get Directions" links
- [ ] Review browser console for errors
- [ ] Test with location permission denied
- [ ] Verify responsive design on all breakpoints

## 🎉 Quick Test

Run the app and:
1. Open browser DevTools console
2. Navigate to homepage
3. Watch for: `[LocationContext] Auto-detecting location...`
4. Grant permission when prompted
5. Should see: `[LocationContext] City detected: [CityName]`
6. Check header for city selector with detected city
7. Navigate to `/buy-car` and verify city banner
8. Navigate to `/locations` and verify map

**Everything working? You're good to go! 🚀**

---

Need help? Check the detailed guides:
- **Developer Guide**: `GEO_FENCING_GUIDE.md`
- **Implementation Summary**: `GEO_FENCING_SUMMARY.md`
