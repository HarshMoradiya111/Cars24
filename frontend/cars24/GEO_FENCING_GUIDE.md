# Geo-Fencing Implementation Guide

## Overview
This document describes the geo-fencing feature implementation that enables city-based car filtering, location detection, and service center mapping in the CARS24 application.

## Features Implemented

### 1. **Location Context Management** (`LocationContext.tsx`)
- **Auto-detection**: Browser geolocation API detects user's location automatically on first load
- **Reverse Geocoding**: Uses OpenStreetMap Nominatim API (free, no API key required) to convert coordinates to city names
- **Fallback to Nearest City**: If reverse geocoding fails, finds the nearest city based on coordinates
- **Manual Selection**: Users can manually select their city from a dropdown
- **Persistent Storage**: Selected city is saved to localStorage for returning users
- **8 Major Cities**: Delhi, Mumbai, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad

### 2. **City Selector Component** (`CitySelector.tsx`)
Located in the header for easy access throughout the application.

**Features:**
- Dropdown with search functionality
- "Detect My Location" button with loading state
- Error handling with user-friendly messages
- Visual indication of selected city
- Responsive design

### 3. **Location Map Component** (`LocationMap.tsx`)
Displays service centers on an embedded Google Maps iframe.

**Features:**
- Google Maps embed showing selected city
- Filter by location type (All, Pickup Hubs, Service Centers)
- List view of all locations with:
  - Name, address, and phone number
  - "Get Directions" link opening Google Maps
  - Visual distinction between pickup hubs and service centers

### 4. **Static Service Center Data**
Each city includes multiple locations:

**Location Types:**
- **Pickup Hubs**: Where users can view and test drive cars
- **Service Centers**: For maintenance and repairs

**Data Structure:**
```typescript
{
  name: string;
  state: string;
  lat: number;
  lng: number;
  serviceCenters: [
    {
      id: string;
      name: string;
      address: string;
      phone: string;
      lat: number;
      lng: number;
      type: 'pickup' | 'service';
    }
  ]
}
```

### 5. **Car Listing Filtering** (`buy-car/index.tsx`)
Car listings are automatically filtered based on selected city.

**Implementation:**
- Filters cars where `location` field contains the selected city name (case-insensitive)
- Shows info banner indicating which city is selected
- Link to view all locations
- Seamless integration with existing filters (price, brand, fuel type, etc.)

### 6. **Dedicated Locations Page** (`/locations`)
Full-page view of locations and map.

**Features:**
- City selector at top
- City information banner
- Embedded Google Maps
- Complete list of service centers with filtering
- Information cards about pickup hubs and service centers
- Contact information section

### 7. **Home Page Integration** (`LocationSection.tsx`)
Shows location information on the home page.

**Features:**
- Statistics (number of pickup hubs and service centers)
- Featured locations (first 2)
- "View All Locations" button

## Technical Implementation

### Context Provider Setup
The `LocationProvider` is added at the app level in `_app.tsx`:

```tsx
<AuthProvider>
  <WishlistProvider>
    <NotificationProvider>
      <LocationProvider>
        <AppContent {...props} />
      </LocationProvider>
    </NotificationProvider>
  </WishlistProvider>
</AuthProvider>
```

### Using Location Context in Components

```tsx
import { useLocation } from '@/context/LocationContext';

const MyComponent = () => {
  const {
    selectedCity,        // Currently selected city name
    setSelectedCity,     // Function to change city
    cityData,           // Full data for selected city
    isDetecting,        // Boolean: geolocation in progress
    detectionError,     // Error message if detection fails
    detectLocation,     // Function to trigger detection
    availableCities     // Array of all available cities
  } = useLocation();

  // Your component logic
};
```

### Geolocation Flow

1. **Initial Load**:
   - Check localStorage for saved city
   - If found, use saved city
   - If not found, trigger auto-detection

2. **Auto-Detection**:
   - Request browser geolocation permission
   - Get coordinates (latitude, longitude)
   - Call OpenStreetMap Nominatim API for reverse geocoding
   - Match result with available cities
   - Fallback to nearest city if no match

3. **Manual Selection**:
   - User opens city selector dropdown
   - Can search cities by name
   - Select from filtered list
   - Save to localStorage

### Google Maps Integration

**Maps Embed API**:
```typescript
const mapUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${lat},${lng}&zoom=11`;
```

**Note**: Replace the placeholder API key in `LocationMap.tsx` with your own Google Maps API key for production use.

**Directions Link**:
```typescript
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
```

## Files Created/Modified

### New Files:
1. `src/context/LocationContext.tsx` - Main context provider
2. `src/components/CitySelector.tsx` - City selection dropdown
3. `src/components/LocationMap.tsx` - Map and service center display
4. `src/pages/locations/index.tsx` - Dedicated locations page
5. `src/components/Home/LocationSection.tsx` - Home page location section

### Modified Files:
1. `src/pages/_app.tsx` - Added LocationProvider
2. `src/components/Header.tsx` - Added CitySelector
3. `src/pages/index.tsx` - Added LocationSection
4. `src/pages/buy-car/index.tsx` - Added city-based filtering

## Configuration

### Environment Variables (Optional)
No additional environment variables required. The implementation uses:
- OpenStreetMap Nominatim (free, no API key)
- Google Maps Embed (requires API key for production)

### Google Maps API Key
To enable full Google Maps functionality:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps Embed API" and "Directions API"
3. Replace the placeholder key in `LocationMap.tsx`:
   ```typescript
   const apiKey = 'YOUR_ACTUAL_API_KEY';
   ```

## Browser Compatibility

**Geolocation API Support**:
- Chrome 5+
- Firefox 3.5+
- Safari 5+
- Edge (all versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Fallback Behavior**:
- If geolocation is not supported or permission denied
- Shows error message
- User can manually select city

## Privacy Considerations

1. **User Consent**: Browser prompts for location permission
2. **No Server Storage**: Location coordinates never sent to backend
3. **Only City Name**: Only city name is stored in localStorage
4. **User Control**: Users can change city anytime via dropdown

## Testing Checklist

- [ ] Location auto-detection on first visit
- [ ] Manual city selection from dropdown
- [ ] City search functionality
- [ ] Car filtering by selected city
- [ ] Service center display on map
- [ ] Directions links working
- [ ] localStorage persistence
- [ ] Mobile responsiveness
- [ ] Error handling (permission denied, no connection)
- [ ] Fallback to nearest city

## Future Enhancements

1. **Backend Integration**:
   - Store actual car locations in database
   - API endpoint to fetch cars by city
   - Dynamic service center data

2. **Advanced Features**:
   - Radius-based search (e.g., "Show cars within 50km")
   - Multiple city selection
   - Distance calculation from user to car
   - Delivery options based on location

3. **Analytics**:
   - Track most popular cities
   - User location patterns
   - Service center visit tracking

4. **Internationalization**:
   - Support for multiple languages
   - Region-specific content
   - Currency conversion

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify internet connection for reverse geocoding
3. Ensure location permission is granted
4. Clear localStorage and retry

## License
This implementation is part of the CARS24 frontend application.
