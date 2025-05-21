/**
 * LEEWAY™ Compatible Mapping Implementation
 * 
 * This file implements mapping technologies compatible with LEEWAY™ standards:
 * - Google Maps integration
 * - Geolocation API
 * - Client-side location tracking
 * - Offline map capabilities
 */

// ======================================================
// 1. Mapping and Location Services
// ======================================================

const LeewayMapping = {
  map: null,
  markers: [],
  infoWindows: [],
  cachedLocations: {},
  
  /**
   * Initialize mapping system
   * @param {Object} options - Configuration options
   * @param {string} options.apiKey - Google Maps API key
   * @param {string} options.mapElementId - Map container element ID
   * @param {Object} options.mapOptions - Google Maps options
   * @param {boolean} options.useGeolocation - Whether to use geolocation
   * @returns {Promise<boolean>} Initialization success
   */
  init: async function(options = {}) {
    this.options = {
      apiKey: options.apiKey || '',
      mapElementId: options.mapElementId || 'map',
      mapOptions: options.mapOptions || {
        center: { lat: 43.0389, lng: -87.9065 }, // Milwaukee by default
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: this.getMapStyles(options.mapTheme || 'default')
      },
      useGeolocation: options.useGeolocation !== false
    };
    
    // Check if Google Maps is already loaded
    if (typeof google === 'undefined' || !google.maps) {
      try {
        await this.loadGoogleMapsAPI();
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
        return false;
      }
    }
    
    // Initialize map
    try {
      await this.initMap();
      
      // Initialize geolocation if enabled
      if (this.options.useGeolocation) {
        this.initGeolocation();
      }
      
      // Load cached locations from IndexedDB
      await this.loadCachedLocations();
      
      return true;
    } catch (error) {
      console.error('Error initializing map:', error);
      return false;
    }
  },
  
  /**
   * Load Google Maps API dynamically
   * @returns {Promise<void>} Promise that resolves when API is loaded
   */
  loadGoogleMapsAPI: function() {
    return new Promise((resolve, reject) => {
      // Check if API is already loaded
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }
      
      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.options.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Set up callbacks
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        const error = new Error('Failed to load Google Maps API');
        console.error(error);
        reject(error);
      };
      
      // Add script to document
      document.head.appendChild(script);
    });
  },
  
  /**
   * Initialize map
   * @returns {Promise<void>} Promise that resolves when map is initialized
   */
  initMap: function() {
    return new Promise((resolve, reject) => {
      try {
        const mapElement = document.getElementById(this.options.mapElementId);
        
        if (!mapElement) {
          reject(new Error(`Map element with ID "${this.options.mapElementId}" not found`));
          return;
        }
        
        this.map = new google.maps.Map(mapElement, this.options.mapOptions);
        
        // Wait for map to be fully loaded
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          console.log('Map initialized successfully');
          resolve();
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        reject(error);
      }
    });
  },
  
  /**
   * Initialize geolocation
   */
  initGeolocation: function() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      return false;
    }
    
    this.geolocationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Update user marker
        this.updateUserMarker(userLocation);
        
        // Store location in memory
        this.currentLocation = userLocation;
        
        // Trigger location update event
        const event = new CustomEvent('leeway-location-update', { detail: userLocation });
        document.dispatchEvent(event);
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000, // 30 seconds
        timeout: 27000 // 27 seconds
      }
    );
    
    return true;
  },
  
  /**
   * Update user marker on map
   * @param {Object} location - User location
   */
  updateUserMarker: function(location) {
    if (!this.map) return;
    
    // Create marker if it doesn't exist
    if (!this.userMarker) {
      this.userMarker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4F46E5',
          fillOpacity: 0.7,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        },
        zIndex: 1000
      });
    } else {
      // Update marker position
      this.userMarker.setPosition(location);
    }
  },
  
  /**
   * Add a marker to the map
   * @param {Object} options - Marker options
   * @returns {Object} Marker object
   */
  addMarker: function(options) {
    if (!this.map) return null;
    
    const marker = new google.maps.Marker({
      position: options.position,
      map: this.map,
      title: options.title || '',
      icon: options.icon,
      animation: options.animation || null
    });
    
    // Add info window if content is provided
    if (options.infoContent) {
      const infoWindow = new google.maps.InfoWindow({
        content: options.infoContent
      });
      
      marker.addListener('click', () => {
        // Close all other info windows
        this.infoWindows.forEach(iw => iw.close());
        
        // Open this info window
        infoWindow.open(this.map, marker);
      });
      
      this.infoWindows.push(infoWindow);
    }
    
    // Store marker
    this.markers.push(marker);
    
    return marker;
  },
  
  /**
   * Clear all markers from the map
   */
  clearMarkers: function() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    
    // Close all info windows
    this.infoWindows.forEach(infoWindow => infoWindow.close());
    this.infoWindows = [];
  },
  
  /**
   * Get directions between two points
   * @param {Object} origin - Origin location
   * @param {Object} destination - Destination location
   * @param {string} travelMode - Travel mode (DRIVING, WALKING, BICYCLING, TRANSIT)
   * @returns {Promise<Object>} Directions result
   */
  getDirections: function(origin, destination, travelMode = 'DRIVING') {
    return new Promise((resolve, reject) => {
      if (!this.map) {
        reject(new Error('Map not initialized'));
        return;
      }
      
      // Create directions service if it doesn't exist
      if (!this.directionsService) {
        this.directionsService = new google.maps.DirectionsService();
      }
      
      // Create directions renderer if it doesn't exist
      if (!this.directionsRenderer) {
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: false,
          preserveViewport: false
        });
      }
      
      // Set up request
      const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode]
      };
      
      // Get directions
      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  },
  
  /**
   * Geocode an address to get coordinates
   * @param {string} address - Address to geocode
   * @returns {Promise<Object>} Location coordinates
   */
  geocodeAddress: function(address) {
    return new Promise((resolve, reject) => {
      // Check if address is already cached
      if (this.cachedLocations[address]) {
        resolve(this.cachedLocations[address]);
        return;
      }
      
      // Create geocoder if it doesn't exist
      if (!this.geocoder) {
        this.geocoder = new google.maps.Geocoder();
      }
      
      // Geocode address
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            formattedAddress: results[0].formatted_address
          };
          
          // Cache location
          this.cachedLocations[address] = location;
          this.saveCachedLocations();
          
          resolve(location);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  },
  
  /**
   * Load cached locations from IndexedDB
   */
  loadCachedLocations: async function() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Location caching disabled.');
        return;
      }
      
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'mapping-store');
      const cachedLocations = await idbKeyval.get('cached-locations', dbPromise);
      
      if (cachedLocations) {
        this.cachedLocations = cachedLocations;
        console.log(`Loaded ${Object.keys(cachedLocations).length} cached locations`);
      }
    } catch (error) {
      console.error('Error loading cached locations:', error);
    }
  },
  
  /**
   * Save cached locations to IndexedDB
   */
  saveCachedLocations: async function() {
    try {
      if (typeof idbKeyval === 'undefined') return;
      
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'mapping-store');
      await idbKeyval.set('cached-locations', this.cachedLocations, dbPromise);
    } catch (error) {
      console.error('Error saving cached locations:', error);
    }
  },
  
  /**
   * Get map styles based on theme
   * @param {string} theme - Map theme
   * @returns {Array} Map styles
   */
  getMapStyles: function(theme) {
    const themes = {
      default: [],
      dark: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
      ],
      light: [
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e9e9e9' }] },
        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] }
      ]
    };
    
    return themes[theme] || themes.default;
  }
};

// Export mapping module
window.LeewayMapping = LeewayMapping;
