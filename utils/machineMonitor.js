const IDLE_THRESHOLD = 5; // นาที
const SPEED_THRESHOLD = 0.1; // m/min

class MachineMonitor {
  constructor(machineId) {
    this.machineId = machineId;
    this.lastActiveTime = new Date();
    this.isBreakdownReported = false;
  }

  updateSpeed(speed) {
    const currentTime = new Date();
    if (speed > SPEED_THRESHOLD) {
      // เครื่องจักรกำลังทำงาน
      this.lastActiveTime = currentTime;
      if (this.isBreakdownReported) {
        this.reportBreakdownEnd();
      }
    } else if (!this.isBreakdownReported && 
               (currentTime - this.lastActiveTime) / 60000 > IDLE_THRESHOLD) {
      // เครื่องจักรหยุดนานเกินกำหนด และยังไม่มีการรายงาน Breakdown
      this.reportBreakdownStart();
    }
  }

  async reportBreakdownStart() {
    this.isBreakdownReported = true;
    // ส่งข้อมูลไปยัง API
    await fetch('/api/report-breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machineId: this.machineId,
        startTime: new Date(),
        reason: 'Auto-detected: Low speed',
        isAutoDetected: true
      })
    });
  }

  async reportBreakdownEnd() {
    this.isBreakdownReported = false;
    // ส่งข้อมูลไปยัง API
    await fetch('/api/update-breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machineId: this.machineId,
        endTime: new Date(),
        isAutoDetected: true
      })
    });
  }
}

module.exports = MachineMonitor;