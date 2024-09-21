// models/inventoryModel.js

// ตัวอย่างฟังก์ชันสำหรับ inventoryModel
exports.getAll = async () => {
    // ในที่นี้คุณจะเขียนโค้ดเพื่อดึงข้อมูล inventory ทั้งหมดจากฐานข้อมูล
    // สำหรับตัวอย่าง เราจะส่งค่า dummy data กลับไป
    return [
      { id: 1, name: 'Item 1', quantity: 100 },
      { id: 2, name: 'Item 2', quantity: 200 },
    ];
  };
  
  exports.updateStock = async (materialId, quantity, action) => {
    // โค้ดสำหรับอัพเดตสต็อก
    console.log(`Updating stock for material ${materialId}: ${action} ${quantity}`);
    // ในที่นี้คุณจะเขียนโค้ดเพื่ออัพเดตข้อมูลในฐานข้อมูล
  };
  
  exports.getLowStock = async () => {
    // ในที่นี้คุณจะเขียนโค้ดเพื่อดึงข้อมูลสินค้าที่มีสต็อกต่ำจากฐานข้อมูล
    // สำหรับตัวอย่าง เราจะ return ค่า dummy
    return [
      { name: 'Item A', currentStock: 5, minimumStockLevel: 10 },
      { name: 'Item B', currentStock: 3, minimumStockLevel: 15 },
      { name: 'Item C', currentStock: 8, minimumStockLevel: 20 }
    ];
  };