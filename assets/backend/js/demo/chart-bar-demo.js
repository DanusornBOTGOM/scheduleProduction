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
var ctx = document.getElementById("myBarChart");

// สร้างฟังก์ชันสำหรับเรียกข้อมูลจากฐานข้อมูล
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

    console.log('Date range:', { startDateTime, endDateTime });

    // Filter data based on date range
    data = data.filter(item => {
      const itemDate = new Date(item.Productiondate);
      console.log('Item date:', itemDate, 'Include:', (!startDateTime || itemDate >= startDateTime) && (!endDateTime || itemDate <= endDateTime));
      return (!startDateTime || itemDate >= startDateTime) &&
             (!endDateTime || itemDate <= endDateTime);
    });

    console.log('Filtered data:', data);

    const labels = data.map(item => ({
      date: new Date(item.Productiondate).toLocaleDateString(),
      machineCode: item.MachineCode2
    }));
    const productionQuantity = data.map(item => parseFloat(item.Productionquantity) || 0);
    const wOut = data.map(item => parseFloat(item.WOut) || 0);

    console.log('Processed data:', { labels, productionQuantity, wOut });
    return { labels, productionQuantity, wOut };
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    throw error;
  }
}

async function createOrUpdateBarChart(startDate, endDate) {
  try {
    const barChartElement = document.getElementById("productionChart");
    if (!barChartElement) {
      console.error('Chart element not found');
      return;
    }

    // ถ้าไม่มีการระบุวันที่ ให้ใช้วันปัจจุบัน
    if (!startDate && !endDate) {
      const today = new Date();
      endDate = today.toISOString().split('T')[0];
      startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
    }

    console.log('Date range:', { startDate, endDate });

    const data = await fetchDataForBarChart(startDate, endDate);

    console.log('Chart data:', data);

    if (!data.labels.length) {
      console.warn('No data available for the selected date range');
      // อาจจะเพิ่มการแจ้งเตือนผู้ใช้ที่นี่
      return;
    }

    // ทำลายกราฟเก่าถ้ามีอยู่
    if (window.myBarChart) {
      window.myBarChart.destroy();
    }

    const barChartContext = barChartElement.getContext('2d');
    const wOutColors = data.wOut.map((wOut, index) => {
      const productionQuantity = data.productionQuantity[index];
      return wOut >= (productionQuantity * 0.95) ? "#1cc88a" : "#e74a3b"; // สีเขียวถ้า >= 95%, สีแดงถ้า < 95%
    });

    window.myBarChart = new Chart(barChartContext, {
      type: 'bar',
      plugins: [{
        afterDraw: chart => {
          var ctx = chart.ctx;
          chart.data.datasets.forEach((dataset, i) => {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach((bar, index) => {
                var data = dataset.data[index];
                var yPos = bar._model.y - 5;
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.font = '11px Arial';
                ctx.fillText(number_format(data), bar._model.x, yPos);
              });
            }
          });
        }
      }],
      data: {
        labels: data.labels.map(label => `${label.machineCode}\n${label.date}`),
        datasets: [{
          label: "Actual (Kg.)",
          backgroundColor: wOutColors,
          hoverBackgroundColor: wOutColors.map(color => color === "#1cc88a" ? "#17a673" : "#e74a3b"),
          borderColor: wOutColors,
          data: data.wOut,
          barPercentage: 0.95,
          categoryPercentage: 0.5
        }, {
          label: "Plan (Kg.)",
          backgroundColor: "#3DC2EC",  // สีของ Production Quantity อยู่ตรงนี้
          hoverBackgroundColor: "#3ABEF9",  // สีเมื่อ hover อยู่ตรงนี้
          borderColor: "#4e73df",  // สีของเส้นขอบอยู่ตรงนี้
          data: data.productionQuantity,
          barPercentage: 0.95,
          categoryPercentage: 0.5
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 20
          }
        },
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
              padding: 10,
              fontSize: 10,
              callback: function(value, index, values) {
                const lines = value.split('\n');
                return lines;
              }
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 10,
              padding: 10,
              callback: function(value, index, values) {
                return number_format(value);
              }
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
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              var value = number_format(tooltipItem.yLabel);
              if (datasetLabel === "WOut") {
                var productionQuantity = chart.datasets[1].data[tooltipItem.index];
                var percentage = ((tooltipItem.yLabel / productionQuantity) * 100).toFixed(2);
                var status = tooltipItem.yLabel >= (productionQuantity * 0.95) ? "Pass" : "Fail";
                return `${datasetLabel}: ${value} (${percentage}% of Production Quantity) - ${status}`;
              }
              return datasetLabel + ': ' + value;
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
  } catch (error) {
    console.error('Error creating chart:', error);
    alert('Error creating chart. Please try again later.');
  }
}


function filterDate() {
    const startDate = document.getElementById('start').value;
    const endDate = document.getElementById('end').value;
    if (startDate && endDate) {
      createOrUpdateBarChart(startDate, endDate);
    } else {
      alert('เลือกทั้งวันที่เริ่มและวันที่สิ้นสุดก่อนกด Filter');
    }
  }

function resetDate() {
  document.getElementById('start').value = '';
  document.getElementById('end').value = '';
  createOrUpdateBarChart();
}

document.addEventListener("DOMContentLoaded", function() {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];

  // ตั้งค่าเริ่มต้นให้กับ input
  document.getElementById('start').value = startDate;
  document.getElementById('end').value = endDate;

  createOrUpdateBarChart(startDate, endDate);

  const filterButton = document.getElementById('filterButton');
  const resetButton = document.getElementById('resetButton');

  if (filterButton) {
    filterButton.addEventListener('click', filterDate);
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', resetDate);
  }
});