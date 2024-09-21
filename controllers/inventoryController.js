const InventoryModel = require('../models/inventoryModel');

exports.index = async (req, res) => {
  try {
    const inventory = await InventoryModel.getAll();
    res.render('pages/inventory/index', { 
      inventory, 
      layout: './layouts/backend',
      title: 'Inventory'
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).render('pages/error', { 
      message: 'Error fetching inventory', 
      layout: './layouts/backend',
      title: 'Error'
    });
  }
};

exports.update = async (req, res) => {
  try {
      // โค้ดสำหรับอัพเดทข้อมูล inventory
      res.json({ message: 'Inventory updated successfully' });
  } catch (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ message: 'Error updating inventory' });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const lowStockItems = await InventoryModel.getLowStock();
    res.render('pages/backend/inventory/low-stock', { // ปรับ path ตรงนี้ให้ตรงกับโครงสร้างโฟลเดอร์ของคุณ
      lowStockItems, 
      layout: './layouts/backend',
      title: 'Low Stock Items'
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).render('pages/error', { 
      message: 'Error fetching low stock items', 
      layout: './layouts/backend',
      title: 'Error'
    });
  }
};

module.exports = {
  index: exports.index,
  update: exports.update,
  getLowStock: exports.getLowStock
};