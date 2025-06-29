# University System Refactoring - API-Driven Architecture

## Overview

The university system has been completely refactored from hardcoded data to a fully API-driven architecture with proper loading states, error handling, and mock data support for development.

## Key Changes Made

### 1. **API Layer (`lib/api/`)**

#### Types (`lib/api/types.ts`)
- **University Interface**: `{ id, code, name }` - structured university data
- **Direction Interface**: `{ id, name, score, rank, range, universityId }` - direction data linked to universities
- **Loading States**: Comprehensive interfaces for loading/error states
- **API Response Types**: Proper typing for API responses

#### Services (`lib/api/services.ts`)
- **UniversityApiService**: Centralized API service class
- **Timeout Handling**: 10-second request timeouts with proper abort signals
- **Error Handling**: Comprehensive error mapping and user-friendly messages
- **Mock Data Integration**: Automatic fallback to mock data for development
- **Parallel Fetching**: Support for parallel directions fetching

#### Mock Data (`lib/api/mockData.ts`)
- **Complete Mock Dataset**: 8+ universities with realistic direction data
- **Network Simulation**: Configurable delays and failure rates
- **Development Ready**: No backend required for testing

### 2. **Data Management (`hooks/useUniversitiesData.ts`)**

#### Smart Fetching Strategy
- **Universities First**: Load universities list before page finishes loading
- **Lazy Directions**: Fetch directions only when university block is expanded
- **Caching**: Prevent duplicate API calls with intelligent caching
- **Parallel Loading**: Multiple direction requests can run simultaneously

#### State Management
- **Loading States**: Track loading status for universities and individual directions
- **Error Handling**: Granular error states with retry mechanisms
- **Cache Management**: Efficient caching prevents unnecessary API calls

### 3. **UI Components**

#### Loading Components (`app/components/LoadingComponents.tsx`)
- **LoadingSpinner**: Reusable spinner with size variants
- **DirectionsLoadingPlaceholder**: Table-styled skeleton loader with shimmer animation
- **DirectionsErrorPlaceholder**: Error state with retry functionality
- **Dark Glass Theme**: Consistent with app's visual design

#### University Block (`app/components/UniversityBlock.tsx`)
- **Smart Loading**: Shows loading state when expanding before data is ready
- **Error Recovery**: Retry buttons for failed requests
- **University Code Display**: Shows university codes alongside names
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

### 4. **Main Page Refactoring (`app/page.tsx`)**

#### Dynamic Content Generation
- **API-Driven Tags**: Tag buttons generated from API data, not hardcoded
- **Loading States**: Universities loading, error, and empty states
- **Responsive Error Handling**: User-friendly error messages with retry options

#### Performance Optimizations
- **Universities Load First**: Critical path optimization
- **Lazy Direction Loading**: Doesn't block initial page load
- **Animation Integration**: Seamless integration with existing GSAP animations
- **Color System Integration**: Works with existing university color system

## Architecture Benefits

### 🚀 **Performance**
- **Fast Initial Load**: Universities list loads first, directions load on-demand
- **Parallel Requests**: Multiple directions can load simultaneously
- **Smart Caching**: Prevents duplicate API calls
- **Lazy Loading**: Only loads data when needed

### 🛡️ **Reliability**
- **Timeout Protection**: 10-second timeouts prevent hanging requests
- **Error Recovery**: Retry mechanisms for failed requests
- **Graceful Degradation**: Falls back to mock data if API unavailable
- **Loading States**: Users always know what's happening

### 🔧 **Developer Experience**
- **TypeScript**: Fully typed API layer and components
- **Mock Data**: No backend required for development
- **Environment Config**: Easy switching between mock and real APIs
- **Clear Separation**: API, state management, and UI clearly separated

### 📱 **User Experience**
- **Fast Perceived Load**: Page appears ready quickly
- **Progressive Loading**: Content appears as it loads
- **Clear Feedback**: Loading animations and error states
- **Retry Options**: Users can recover from errors

## Configuration

### Environment Variables
```bash
# Use mock data (default: true if no API_BASE_URL)
NEXT_PUBLIC_USE_MOCK_API=true

# Real API base URL (set when backend is available)
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
```

### Mock Data Features
- **Realistic Data**: Based on original hardcoded data
- **Configurable Delays**: Simulate network conditions
- **Random Failures**: Test error handling
- **Development Ready**: Works out of the box

## API Endpoints Expected

### Universities List
```
GET /api/universities
Response: {
  universities: [
    { id: "uni-001", code: "МФТИ", name: "МФТИ" }
  ]
}
```

### University Directions
```
GET /api/universities/{universityId}/directions
Response: {
  universityId: "uni-001",
  directions: [
    {
      id: "dir-001",
      name: "Математика",
      score: 283,
      rank: "#12",
      range: "283..271",
      universityId: "uni-001"
    }
  ]
}
```

## Testing

The system has been designed with comprehensive testing in mind:

1. **Mock Data**: Test without backend
2. **Error Simulation**: Test error handling
3. **Loading States**: Test all UI states
4. **Network Conditions**: Simulate slow/fast networks
5. **TypeScript**: Compile-time type checking

## Migration Complete

✅ **Removed**: All hardcoded university data  
✅ **Removed**: All hardcoded tag buttons  
✅ **Added**: Complete API architecture  
✅ **Added**: Loading and error states  
✅ **Added**: Mock data system  
✅ **Added**: Smart caching and performance optimization  
✅ **Maintained**: All existing animations and styling  
✅ **Maintained**: University color system integration  

The application is now ready for production with a real API backend, while remaining fully functional for development with mock data. 