const IDLE_THRESHOLD = 5; // นาที
const SPEED_THRESHOLD = 0.1; // m/min

const breaks = [
  { start: [10, 0], end: [10, 15] },
  { start: [11, 0], end: [11, 30] },
  { start: [15, 0], end: [15, 15] },
  { start: [17, 0], end: [17, 30] }
];

function calculateProductionTime(weight, diameter, density, machineSpeed, startTime, includeOT = false) {
  // แปลงน้ำหนักเป็นความยาว
  const crossSectionArea = Math.PI * Math.pow(diameter / 20, 2);
  const volumePerMeter = crossSectionArea * 100;
  const weightPerMeter = volumePerMeter * density / 1000;
  const totalLength = weight / weightPerMeter;

  // คำนวณเวลาที่ใช้ในการผลิต
  const productionTimeMinutes = totalLength / machineSpeed;

  let currentTime = new Date(startTime);
  let remainingProductionTime = productionTimeMinutes;

  while (remainingProductionTime > 0) {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // ตรวจสอบว่าอยู่ในช่วงเวลาพักหรือไม่
    const isBreakTime = breaks.some(breakTime => 
      (currentHour > breakTime.start[0] || (currentHour === breakTime.start[0] && currentMinute >= breakTime.start[1])) &&
      (currentHour < breakTime.end[0] || (currentHour === breakTime.end[0] && currentMinute < breakTime.end[1]))
    );

    if (isBreakTime) {
      // ถ้าอยู่ในช่วงพัก ให้ข้ามไปยังเวลาสิ้นสุดของช่วงพักนั้น
      const currentBreak = breaks.find(breakTime => 
        (currentHour > breakTime.start[0] || (currentHour === breakTime.start[0] && currentMinute >= breakTime.start[1])) &&
        (currentHour < breakTime.end[0] || (currentHour === breakTime.end[0] && currentMinute < breakTime.end[1]))
      );
      currentTime.setHours(currentBreak.end[0], currentBreak.end[1]);
    } else {
      // ถ้าไม่อยู่ในช่วงพัก ให้เพิ่มเวลาการผลิต
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      remainingProductionTime--;
    }

    // ตรวจสอบว่าถึงเวลาเลิกงานหรือยัง (17:30)
    if (!includeOT && currentTime.getHours() >= 17 && currentTime.getMinutes() >= 30) {
      // ถ้าไม่มี OT ให้เลื่อนไปวันถัดไป
      currentTime.setDate(currentTime.getDate() + 1);
      currentTime.setHours(8, 0, 0, 0);  // เริ่มงานใหม่เวลา 8:00 น.
    }
  }

  return {
    totalLength: totalLength,
    productionTimeMinutes: productionTimeMinutes,
    endTime: currentTime
  };
}

module.exports = { calculateProductionTime };