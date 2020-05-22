const router = require('express').Router();
const _ = require('lodash');
const User = require('../models/Users');
const checkRole = require('../middleware').checkRole;

const getAllUsers = (req, res) => {
  User
    .find()
    .populate('user_role')
    .then((users) => {
      res.send({ success: true ,users});
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar usuarios',
      });
    });
};

const getUser = (req, res) => {
  User
    .findById(req.user.id)
    .populate('user_role')
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `Usuario no encontrado id: ${req.user.id}`,
        });
      }
      res.send({ user });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar usuario',
      });
    });
};

const createUser = (req, res) => {
  const user = new User({
    user_first_name: req.body.user_first_name,
    user_last_name: req.body.user_last_name,
    user_email: req.body.user_email,
    user_role: req.body.user_role,
    user_password: req.body.user_password,
    user_active: true,
    user_phone1: req.body.user_phone1,
    user_phone2: req.body.user_phone2,
  });
  user.save()
    .then((user) => {
      res.send({ success: true ,user});
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error al guardar usuario', success: false });
    });
};

const updateUser = (req, res) => {
  const user = {
    user_first_name: req.body.user_first_name,
    user_last_name: req.body.user_last_name,
    user_role: req.body.user_role,
    user_phone1: req.body.user_phone1,
    user_phone2: req.body.user_phone2,
  };

  User.findByIdAndUpdate(req.params.id, user, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: `Usuario no encontrado id: ${req.params.id}`, success: false });
      }
      res.send({ user , success: true });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error al actualizar usuario', success: false });
    });
};

const findIfUserExists = (req, res) => {
  User.find({ user_email: req.params.user_email }).then((response) => {
    res.send({ exists: response });
  });
};

const deactivateUser = (req, res) => {
  const { id } = req.params;
  User
    .findById(id)
    .populate('user_role')
    .then((user) => {
      User
        .findById(req.user.id)
        .then(() => {
            user.user_active = false;
            user
              .save()
              .then((response) => {
                res.json({ success: true, user: response });
              })
              .catch((e) => {
                res.json({ success: false, error: e });
              });
        })
        .catch((e) => {
          res.json({ success: false, error: e });
        });
    })
    .catch((e) => {
      res.json({ success: false, error: e });
    });
};

router.get('/', checkRole(['administrator']), getAllUsers);
router.post('/', checkRole(['administrator']), createUser);
router.get('/current', checkRole(['administrator']), getUser);
router.put('/:id', checkRole(['administrator']), updateUser);
router.put('/:id/deactive', checkRole(['administrator']), deactivateUser);
router.get('/findIfExists/:email',checkRole(['administrator']), findIfUserExists);

module.exports = router;
