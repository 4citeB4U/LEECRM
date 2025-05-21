/**
 * Analytics System for Agent Lee CRM
 * Handles chart initialization and data visualization
 */

// Initialize analytics system
function initializeAnalyticsSystem() {
  console.log('Initializing Analytics System...');
  
  // Initialize charts
  const campaignPerformanceChart = document.getElementById('campaign-performance-chart');
  const engagementMetricsChart = document.getElementById('engagement-metrics-chart');
  const geographicDistributionChart = document.getElementById('geographic-distribution-chart');
  const deviceUsageChart = document.getElementById('device-usage-chart');

  // Campaign Performance Chart
  if (campaignPerformanceChart) {
    new Chart(campaignPerformanceChart, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Open Rate',
          data: [65, 59, 80, 81, 56, 55],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }, {
          label: 'Click Rate',
          data: [28, 48, 40, 19, 86, 27],
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Engagement Metrics Chart
  if (engagementMetricsChart) {
    new Chart(engagementMetricsChart, {
      type: 'bar',
      data: {
        labels: ['Email', 'Social', 'Direct', 'Referral'],
        datasets: [{
          label: 'Engagement Rate',
          data: [75, 62, 45, 80],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  // Geographic Distribution Chart
  if (geographicDistributionChart) {
    new Chart(geographicDistributionChart, {
      type: 'pie',
      data: {
        labels: ['Midwest', 'Northeast', 'South', 'West', 'International'],
        datasets: [{
          label: 'Distribution',
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Device Usage Chart
  if (deviceUsageChart) {
    new Chart(deviceUsageChart, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          label: 'Device Usage',
          data: [55, 35, 10],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 206, 86)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Set up date range filter
  const analyticsPeriod = document.getElementById('analytics-period');
  const customDateRange = document.getElementById('custom-date-range');
  const updateAnalyticsBtn = document.getElementById('update-analytics');
  
  if (analyticsPeriod) {
    analyticsPeriod.addEventListener('change', function() {
      if (this.value === 'custom' && customDateRange) {
        customDateRange.classList.remove('hidden');
      } else if (customDateRange) {
        customDateRange.classList.add('hidden');
      }
    });
  }
  
  if (updateAnalyticsBtn) {
    updateAnalyticsBtn.addEventListener('click', function() {
      updateAnalyticsData();
    });
  }
  
  // Load campaign performance table
  loadCampaignPerformanceTable();
}

// Update analytics data based on selected period
function updateAnalyticsData() {
  console.log('Updating analytics data...');
  
  // Get selected period
  const analyticsPeriod = document.getElementById('analytics-period');
  const dateFrom = document.getElementById('date-from');
  const dateTo = document.getElementById('date-to');
  
  let period = 30; // Default to 30 days
  
  if (analyticsPeriod) {
    if (analyticsPeriod.value === 'custom' && dateFrom && dateTo && dateFrom.value && dateTo.value) {
      // Custom date range selected
      const fromDate = new Date(dateFrom.value);
      const toDate = new Date(dateTo.value);
      
      // Calculate days between dates
      const diffTime = Math.abs(toDate - fromDate);
      period = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      // Predefined period selected
      period = parseInt(analyticsPeriod.value) || 30;
    }
  }
  
  // Update charts with new data
  updateCharts(period);
  
  // Update campaign performance table
  loadCampaignPerformanceTable(period);
}

// Update charts with new data
function updateCharts(period) {
  console.log(`Updating charts for period: ${period} days`);
  
  // In a real application, this would fetch data from the server
  // For now, we'll just simulate different data for different periods
  
  // Get chart instances
  const campaignPerformanceChart = Chart.getChart('campaign-performance-chart');
  const engagementMetricsChart = Chart.getChart('engagement-metrics-chart');
  const geographicDistributionChart = Chart.getChart('geographic-distribution-chart');
  const deviceUsageChart = Chart.getChart('device-usage-chart');
  
  // Update campaign performance chart
  if (campaignPerformanceChart) {
    // Generate labels based on period
    const labels = [];
    const openRateData = [];
    const clickRateData = [];
    
    // Generate random data based on period
    for (let i = 0; i < Math.min(period, 12); i++) {
      labels.push(`Month ${i+1}`);
      openRateData.push(Math.floor(Math.random() * 40) + 40); // 40-80%
      clickRateData.push(Math.floor(Math.random() * 30) + 10); // 10-40%
    }
    
    campaignPerformanceChart.data.labels = labels;
    campaignPerformanceChart.data.datasets[0].data = openRateData;
    campaignPerformanceChart.data.datasets[1].data = clickRateData;
    campaignPerformanceChart.update();
  }
  
  // Update other charts similarly
  // ...
}

// Load campaign performance table
function loadCampaignPerformanceTable(period = 30) {
  console.log(`Loading campaign performance table for period: ${period} days`);
  
  const tableBody = document.getElementById('campaign-performance-table');
  if (!tableBody) return;
  
  // Clear table
  tableBody.innerHTML = '';
  
  // Generate sample data
  const campaigns = [
    {
      name: 'Summer Promotion',
      date: '2023-05-15',
      recipients: 1250,
      openRate: 68.5,
      clickRate: 24.3,
      responseRate: 12.1
    },
    {
      name: 'New Product Launch',
      date: '2023-04-22',
      recipients: 980,
      openRate: 72.1,
      clickRate: 31.5,
      responseRate: 15.8
    },
    {
      name: 'Customer Feedback Survey',
      date: '2023-03-10',
      recipients: 750,
      openRate: 65.3,
      clickRate: 22.7,
      responseRate: 18.2
    },
    {
      name: 'Spring Newsletter',
      date: '2023-02-28',
      recipients: 1100,
      openRate: 61.8,
      clickRate: 19.5,
      responseRate: 8.7
    },
    {
      name: 'Holiday Greetings',
      date: '2023-01-15',
      recipients: 1500,
      openRate: 75.2,
      clickRate: 28.9,
      responseRate: 14.3
    }
  ];
  
  // Filter campaigns based on period
  const today = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(today.getDate() - period);
  
  const filteredCampaigns = campaigns.filter(campaign => {
    const campaignDate = new Date(campaign.date);
    return campaignDate >= cutoffDate;
  });
  
  // Add rows to table
  if (filteredCampaigns.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-4 text-center text-dark-500 dark:text-dark-400">
          No campaigns found in the selected period.
        </td>
      </tr>
    `;
    return;
  }
  
  filteredCampaigns.forEach(campaign => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-dark-50 dark:hover:bg-dark-700/50';
    
    row.innerHTML = `
      <td class="px-4 py-3 text-dark-900 dark:text-white">${campaign.name}</td>
      <td class="px-4 py-3 text-dark-600 dark:text-dark-400">${formatDate(campaign.date)}</td>
      <td class="px-4 py-3 text-dark-600 dark:text-dark-400">${campaign.recipients.toLocaleString()}</td>
      <td class="px-4 py-3 text-dark-600 dark:text-dark-400">${campaign.openRate}%</td>
      <td class="px-4 py-3 text-dark-600 dark:text-dark-400">${campaign.clickRate}%</td>
      <td class="px-4 py-3 text-dark-600 dark:text-dark-400">${campaign.responseRate}%</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
