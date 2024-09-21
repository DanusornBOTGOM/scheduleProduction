// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Bar Chart Example
var ctx = document.getElementById("BarChartNCR");

async function fetchDataForBarChart(startDate, endDate) {
    try {
      let url = 'http://192.168.1.42:5000/backend/showproduct';
      const response = await fetch(url);
      let data = await response.json();
      console.log('Raw data:', data);
  
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data is not an array or is empty');
      }
  
      // แปลงวันที่ input เป็น Date object
      const startDateTime = startDate ? new Date(startDate) : null;
      const endDateTime = endDate ? new Date(endDate) : null;
      endDateTime?.setHours(23, 59, 59, 999);
  
      // Filter data based on date range
      data = data.filter(item => {
        const itemDate = new    Date(item.Productiondate);
        return (!startDateTime || itemDate >= startDateTime) &&
               (!endDateTime || itemDate <= endDateTime);
      });
  
      const labels = data.map(item => ({
        date: new Date(item.Productiondate).toLocaleDateString(),
        machineCode: item.MachineCode2
      }));
      const productionQuantity = data.map(item => parseFloat(item.Productionquantity) || 0);
      const wOut = data.map(item => parseFloat(item.WOut) || 0);
      const nc = data.map(item => parseFloat(item.NC) || 0);  // เพิ่มข้อมูล NC
  
      console.log('NC data:', data.map(item => item.NC));
      console.log('Processed data:', { labels, productionQuantity, wOut, nc });
      return { labels, productionQuantity, wOut, nc };
    } catch (error) {
      console.error('Error fetching or processing data:', error);
      throw error;
    }
  }

  async function createOrUpdateNCChart(startDate, endDate) {
    try {
      const data = await fetchDataForBarChart(startDate, endDate);
      console.log('Data for NC chart:', data);
      createNCChart(data);
    } catch (error) {
      console.error('Error creating NC chart:', error);
      alert('Error creating NC chart. Please try again later.');
    }
  }

  function createNCChart(data) {
    if (!data || !data.nc || data.nc.length === 0) {
      console.warn('No NC data available');
      return;
    }
  
    const ncChartElement = document.getElementById("BarChartNCR");
    if (!ncChartElement) {
      console.error('NC Chart element not found');
      return;
    }
  
    if (window.ncChart) {
      window.ncChart.destroy();
    }
  
    const ncChartContext = ncChartElement.getContext('2d');
    window.ncChart = new Chart(ncChartContext, {
      type: 'bar',
      data: {
        labels: data.labels.map(label => `${label.machineCode}\n${label.date}`),
        datasets: [{
          label: "NCR (Kg.)",
          backgroundColor: "#e74a3b",
          hoverBackgroundColor: "#e74a3b",
          borderColor: "#e74a3b",
          data: data.nc,
          barPercentage: 0.8,
          categoryPercentage: 0.5
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 20,
              autoSkip: true,
              maxRotation: 45,
              minRotation: 45,
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 10,
              callback: function(value) { return number_format(value); }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: true,
          position: 'top',
        },
        tooltips: {
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              return "NC: " + number_format(tooltipItem.yLabel);
            },
            title: function(tooltipItems, data) {
              const index = tooltipItems[0].index;
              const label = data.labels[index].split('\n');
              return `Machine: ${label[0]}\nDate: ${label[1]}`;
            }
          }
        }
      }
    });
  }



  document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
  
    createOrUpdateNCChart(startDate, endDate);
  
    const filterButton = document.getElementById('filterButton');
    const resetButton = document.getElementById('resetButton');
  
    if (filterButton) {
      filterButton.addEventListener('click', function() {
        const startDate = document.getElementById('start').value;
        const endDate = document.getElementById('end').value;
        if (startDate && endDate) {
          createOrUpdateNCChart(startDate, endDate);
        }
      });
    }
   
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        document.getElementById('start').value = startDate;
        document.getElementById('end').value = endDate;
        createOrUpdateNCChart(startDate, endDate);
      });
    }
  });