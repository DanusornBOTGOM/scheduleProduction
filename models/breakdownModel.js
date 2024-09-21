// models/breakdownModel.js

exports.reportBreakdown = async (machineId, startTime, reason, isAutoDetected) => {
    // ในที่นี้คุณจะเขียนโค้ดเพื่อบันทึกข้อมูล Breakdown ลงในฐานข้อมูล
    console.log(`Reporting breakdown for machine ${machineId}: ${reason} at ${startTime}`);
    // สำหรับตัวอย่าง เราจะ return ค่า dummy
    return { id: Date.now(), machineId, startTime, reason, isAutoDetected };
  };
  
  exports.updateBreakdown = async (machineId, endTime, isAutoDetected) => {
    // ในที่นี้คุณจะเขียนโค้ดเพื่ออัพเดทข้อมูล Breakdown ในฐานข้อมูล
    console.log(`Updating breakdown for machine ${machineId}: ended at ${endTime}`);
    // สำหรับตัวอย่าง เราจะ return ค่า dummy
    return { success: true, machineId, endTime, isAutoDetected };
  };
  
  exports.getBreakdowns = async (startDate, endDate) => {
    // ในที่นี้คุณจะเขียนโค้ดเพื่อดึงข้อมูล Breakdowns จากฐานข้อมูล
    console.log(`Getting breakdowns from ${startDate} to ${endDate}`);
    // สำหรับตัวอย่าง เราจะ return ค่า dummy
    return [
      { id: 1, machineId: 'M001', startTime: '2024-03-10T10:00:00Z', endTime: '2024-03-10T11:00:00Z', reason: 'Overheating' },
      { id: 2, machineId: 'M002', startTime: '2024-03-12T14:30:00Z', endTime: '2024-03-12T15:45:00Z', reason: 'Power failure' }
    ];
  };