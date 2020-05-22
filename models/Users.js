const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  user_first_name: String,
  user_last_name: String,
  user_email: { type: String, unique: true },
  user_password: { type: String, select: true },
  user_role: { type: Schema.Types.ObjectId, ref: 'Roles' },
  user_phone1: String,
  user_phone2: String,
  user_active: Boolean,
}, {
  timestamps: true,
});

UsersSchema.pre('save', function hashPwd(next) {
  const user = this;
  if (!user.isModified('user_password')) return next();

  bcrypt.hash(user.user_password, 10, (err, hash) => {
    if (err) return next(err);
    user.user_password = hash;
    return next();
  });
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
