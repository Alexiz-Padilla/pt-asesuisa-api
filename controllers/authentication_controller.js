const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/index')(process.env.NODE_ENV);
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const router = express.Router();

const login = (req, res) => {
  User
    .findOne({ user_email: req.body.user_email })
    .select('+user_password')
    .populate('user_role')
    .then((user) => {
      if (!user) {
        return res.json({ success: false, type: 'email', message: 'El correo electrónico que ingresó no está asociado con ninguna cuenta' });
      } else if (!bcrypt.compareSync(req.body.user_password, user.user_password)) {
        return res.json({ success: false, type: 'password', message: 'Contraseña invalida' });
      } else if (!user.user_active) {
        return res.json({ success: false, type: 'user', message: 'El usuario no esta activo' });
      }

      const payload = { id: user._id,
        name: user.user_first_name,
        email: user.user_email,
        role: user.user_role.role_name };

      const token = jwt.sign(payload, config.secret, { expiresIn: 60 * 60 * 24 * 30 });

      return res.json({ success: true,
        token,
        user });
    })
    .catch((err) => {
      res.json({ success: false, message: err.message });
    });
};

const checkSessionToken = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await jwt.verify(token, config.secret);
    const user = await User.findOne({ _id: decoded.id })
      .populate('user_role');
    if (user) {
      if (!user.user_active) {
        return res.json({ success: false, message: 'Credenciales no válidas' });
      }

      return res.json({ success: true, user });
    } else {
      return res.status(400).send({ success: false,
        message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res.json({ success: false, message: 'Error al autenticar el token' });
  }
};

router.post('/login', login);
router.post('/check-session-token', checkSessionToken);

module.exports = router;
