const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Gender = new Schema({
  gender_name: String,
  gender_active: Boolean,
});

module.exports = mongoose.model('Genders', Gender);
