/**
 * LEEWAY™ Compatible Analytics Implementation
 * 
 * This file implements analytics technologies compatible with LEEWAY™ standards:
 * - Client-side analytics processing
 * - Chart.js for data visualization
 * - IndexedDB for data storage
 * - Google Analytics integration (client-side)
 */

// ======================================================
// 1. Analytics Data Processing
// ======================================================

const LeewayAnalytics = {
  dbPromise: null,
  
  /**
   * Initialize analytics system
   * @param {Object} options - Configuration options
   */
  init: async function(options = {}) {
    // Initialize IndexedDB
    if (typeof idbKeyval === 'undefined') {
      console.error('idb-keyval library not loaded. Please include the idb-keyval script in your HTML.');
      return false;
    }
    
    this.dbPromise = idbKeyval.createStore('agent-lee-crm', 'analytics-store');
    
    // Initialize Google Analytics if available
    if (options.gaTrackingId && typeof gtag !== 'undefined') {
      this.initGoogleAnalytics(options.gaTrackingId);
    }
    
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
      this.initCharts();
    }
    
    return true;
  },
  
  /**
   * Initialize Google Analytics
   * @param {string} trackingId - GA tracking ID
   */
  initGoogleAnalytics: function(trackingId) {
    // Add GA script if not already present
    if (typeof gtag === 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      gtag('js', new Date());
    }
    
    gtag('config', trackingId);
    this.gaTrackingId = trackingId;
    console.log('Google Analytics initialized with tracking ID:', trackingId);
  },
  
  /**
   * Initialize chart instances
   */
  initCharts: function() {
    // Will be populated with chart instances
    this.charts = {};
    console.log('Chart.js integration ready');
  },
  
  /**
   * Track an event
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {string} label - Event label
   * @param {number} value - Event value
   */
  trackEvent: async function(category, action, label, value) {
    // Store event in IndexedDB
    const event = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Get existing events
      const events = await idbKeyval.get('analytics-events', this.dbPromise) || [];
      events.push(event);
      await idbKeyval.set('analytics-events', events, this.dbPromise);
      
      // Send to Google Analytics if available
      if (this.gaTrackingId && typeof gtag !== 'undefined') {
        gtag('event', action, {
          'event_category': category,
          'event_label': label,
          'value': value
        });
      }
      
      console.log('Event tracked:', event);
      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  },
  
  /**
   * Track a page view
   * @param {string} pagePath - Page path
   * @param {string} pageTitle - Page title
   */
  trackPageView: function(pagePath, pageTitle) {
    // Store page view in IndexedDB
    const pageView = {
      pagePath,
      pageTitle,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Send to Google Analytics if available
      if (this.gaTrackingId && typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
          page_path: pagePath,
          page_title: pageTitle
        });
      }
      
      console.log('Page view tracked:', pageView);
      return true;
    } catch (error) {
      console.error('Error tracking page view:', error);
      return false;
    }
  },
  
  /**
   * Create a campaign performance chart
   * @param {string} canvasId - Canvas element ID
   * @param {Array} campaigns - Campaign data
   */
  createCampaignPerformanceChart: function(canvasId, campaigns) {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded');
      return null;
    }
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas element not found:', canvasId);
      return null;
    }
    
    // Process campaign data
    const labels = campaigns.map(c => c.title);
    const openRates = campaigns.map(c => c.openRate || 0);
    const clickRates = campaigns.map(c => c.clickRate || 0);
    const responseRates = campaigns.map(c => c.responseRate || 0);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Open Rate (%)',
            data: openRates,
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
          },
          {
            label: 'Click Rate (%)',
            data: clickRates,
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          },
          {
            label: 'Response Rate (%)',
            data: responseRates,
            backgroundColor: 'rgba(245, 158, 11, 0.5)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Campaign Performance'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          }
        }
      }
    });
    
    // Store chart instance
    this.charts[canvasId] = chart;
    return chart;
  },
  
  /**
   * Create a geographic distribution chart
   * @param {string} canvasId - Canvas element ID
   * @param {Object} geoData - Geographic distribution data
   */
  createGeographicDistributionChart: function(canvasId, geoData) {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded');
      return null;
    }
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas element not found:', canvasId);
      return null;
    }
    
    // Process geographic data
    const labels = Object.keys(geoData);
    const data = Object.values(geoData);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(14, 165, 233, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Geographic Distribution'
          }
        }
      }
    });
    
    // Store chart instance
    this.charts[canvasId] = chart;
    return chart;
  },
  
  /**
   * Get analytics data for a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Analytics data
   */
  getAnalyticsData: async function(startDate, endDate) {
    try {
      // Get campaigns from IndexedDB
      const campaigns = await idbKeyval.get('campaigns', this.dbPromise) || [];
      
      // Filter campaigns by date range
      const filteredCampaigns = campaigns.filter(campaign => {
        const campaignDate = new Date(campaign.sentDate || campaign.scheduledDate || campaign.createdAt);
        return campaignDate >= startDate && campaignDate <= endDate;
      });
      
      // Calculate analytics metrics
      let totalOpenRate = 0;
      let totalClickRate = 0;
      let totalResponseRate = 0;
      let sentCampaigns = 0;
      
      filteredCampaigns.forEach(campaign => {
        if (campaign.status === 'sent') {
          totalOpenRate += campaign.openRate || 0;
          totalClickRate += campaign.clickRate || 0;
          totalResponseRate += campaign.responseRate || 0;
          sentCampaigns++;
        }
      });
      
      const avgOpenRate = sentCampaigns > 0 ? (totalOpenRate / sentCampaigns).toFixed(1) : 0;
      const avgClickRate = sentCampaigns > 0 ? (totalClickRate / sentCampaigns).toFixed(1) : 0;
      const avgResponseRate = sentCampaigns > 0 ? (totalResponseRate / sentCampaigns).toFixed(1) : 0;
      
      return {
        campaigns: filteredCampaigns,
        metrics: {
          avgOpenRate,
          avgClickRate,
          avgResponseRate,
          totalCampaigns: filteredCampaigns.length,
          sentCampaigns
        }
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return {
        campaigns: [],
        metrics: {
          avgOpenRate: 0,
          avgClickRate: 0,
          avgResponseRate: 0,
          totalCampaigns: 0,
          sentCampaigns: 0
        }
      };
    }
  }
};

// Export analytics module
window.LeewayAnalytics = LeewayAnalytics;
