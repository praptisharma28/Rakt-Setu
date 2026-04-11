const { createModel } = require('../config/db');

const inventoryModel = createModel('inventory', [
  'inventoryType', 'bloodGroup', 'quantity',
  'email', 'organisation', 'hospital', 'donar'
]);

module.exports = inventoryModel;
