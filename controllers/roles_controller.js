const router = require('express').Router();
const _ = require('lodash');
const Role = require('../models/Role');
const checkRole = require('../middleware').checkRole;

const getAllRoles = (req, res) => {
  Role
    .find()
    .then((roles) => {
      res.send(roles);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar roles',
      });
    });
};

const getRole = (req, res) => {
  Role
    .findById(req.role.id)
    .then((role) => {
      if (!role) {
        return res.status(404).send({
          message: `Rol no encontrado id: ${req.role.id}`,
        });
      }
      res.send({ role });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar rol',
      });
    });
};

const createRole = (req, res) => {
  const role = new Role({
    role_name: req.body.role_name,
    role_active: req.body.role_active,
  });
  role.save()
    .then((role) => {
      res.send(role);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error al guardar roles' });
    });
};

const updateRole = (req, res) => {
  const role = {
    role_name: req.body.role_name,
  };

  Role.findByIdAndUpdate(req.params.id, role, { new: true })
    .then((role) => {
      if (!role) {
        return res.status(404).send({ message: `Rol no encontrado id: ${req.params.id}` });
      }
      res.send(role);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error al actualizar rol' });
    });
};

const deactivateRole = (req, res) => {
  const { id } = req.params;
  Role
    .findById(id)
    .then((role) => {
      Role
        .findById(req.role.id)
        .then(() => {
            user.user_active = false;
            role
              .save()
              .then((response) => {
                res.json({ success: true, role: response });
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

router.post('/',checkRole(['administrator']), createRole);
router.get('/', checkRole(['administrator']), getAllRoles);
router.get('/current',checkRole(['administrator']), getRole);
router.put('/:id',checkRole(['administrator']), updateRole);
router.put('/:id/deactive', checkRole(['administrator']), deactivateRole);

module.exports = router;
