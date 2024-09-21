let scheduleItems = [
  { id: 1, product: 'W2401150', quantity: 150, startTime: '2024-03-15T15:00:00Z', endTime: '2024-03-15T23:00:00Z', status: 'รอดำเนินการ', progress: 0, department: 'Drawing' },
  { id: 2, product: 'W2409587', quantity: 250, startTime: '2024-03-16T15:00:00Z', endTime: '2024-03-17T01:00:00Z', status: 'รอดำเนินการ', progress: 0, department: 'BAR2' },
  { id: 3, product: 'W2405872', quantity: 500, startTime: '2024-03-16T15:00:00Z', endTime: '2024-03-17T01:00:00Z', status: 'รอดำเนินการ', progress: 0, department: 'CGM' },
  { id: 4, product: 'W2406789', quantity: 300, startTime: '2024-03-17T09:00:00Z', endTime: '2024-03-17T18:00:00Z', status: 'รอดำเนินการ', progress: 0, department: 'profile' },
];

exports.getSchedule = async (departments) => {
  console.log('Filtering for departments:', departments);
  const filteredItems = scheduleItems.filter(item => departments.includes(item.department));
  console.log('Filtered items:', filteredItems);
  return filteredItems.map(item => ({
    ...item,
    timeLeft: calculateTimeLeft(item.endTime)
  }));
};

exports.updateStatus = async (id, status, progress) => {
  const index = scheduleItems.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    scheduleItems[index].status = status;
    scheduleItems[index].progress = parseInt(progress);
    return scheduleItems[index];
  }
  return null;
};

exports.calculateMetrics = async () => {
  const totalItems = scheduleItems.length;
  const completedItems = scheduleItems.filter(item => item.status === 'เสร็จสิ้น').length;
  const overallProgress = Math.round((scheduleItems.reduce((sum, item) => sum + item.progress, 0) / totalItems));

  return {
    overallProgress,
    items: scheduleItems.map(item => ({
      id: item.id,
      progress: item.progress
    }))
  };
};

function calculateTimeLeft(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;
  if (diff <= 0) return 'Overdue';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

