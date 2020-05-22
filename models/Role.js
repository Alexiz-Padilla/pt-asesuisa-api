const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Role = new Schema({
  role_name: String,
  role_active: Boolean,
});

module.exports = mongoose.model('Roles', Role);
