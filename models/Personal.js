const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonalInformation = new Schema({
  pi_prefix: String,
  pi_first_name: String,
  pi_second_name: String,
  pi_first_surname: String,
  pi_second_surname: String,  
  pi_married_lastname: String,
  pi_DUI: String,
  pi_NIT: String,
  pi_birthdate: String,
  pi_is_adult: Boolean,
  pi_phone: String,
  pi_address: String,
  pi_email: String,
  pi_gender: {type: Schema.Types.ObjectId, ref: 'Genders' },
  pi_active: Boolean
});

module.exports = mongoose.model('PersonalInformations', PersonalInformation);
