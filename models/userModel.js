const { createModel } = require('../config/db');

const userModel = createModel('users', [
  'role', 'name', 'organisationName', 'hospitalName',
  'email', 'password', 'website', 'address', 'phone',
  'bloodGroup', 'lastDonation', 'totalDonations', 'isAvailable'
]);

module.exports = userModel;
