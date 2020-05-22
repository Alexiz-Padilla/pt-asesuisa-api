const router = require('express').Router();
const _ = require('lodash');
const Gender = require('../models/Gender');
const checkRole = require('../middleware').checkRole;

const getAllGenders = (req, res) => {
    Gender
    .find()
    .then((genders) => {
      res.send(genders);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar genero',
      });
    });
};

const getGender = (req, res) => {
    Gender
    .findById(req.role.id)
    .then((gender) => {
      if (!gender) {
        return res.status(404).send({
          message: `Genero no encontrado id: ${req.role.id}`,
        });
      }
      res.send({ role });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar genero',
      });
    });
};

const createGender = (req, res) => {
  const gender = new Gender({
    gender_name: req.body.gender_name,
    gender_active: req.body.gender_active,
  });
  gender.save()
    .then((gender) => {
      res.send(gender);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error al guardar el genero' });
    });
};

const updateGender = (req, res) => {
  const gender = {
    gender_name: req.body.gender_name,
  };

  Gender.findByIdAndUpdate(req.params.id, gender, { new: true })
    .then((gender) => {
      if (!gender) {
        return res.status(404).send({ message: `Genero no encontrado id: ${req.params.id}` });
      }
      res.send(gender);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error al actualizar genero' });
    });
};

const deactivateGender = (req, res) => {
  const { id } = req.params;
  Gender
    .findByIdAndUpdate({ _id: id}, {gender_active: false}, {new: true})
    .then((response) => {
        if (!response) {
            return res.status(404).send({ message: `Genero no encontrado id: ${id}` });
        }
       res.json({ success: true, gender: response });
    })
    .catch((e) => {
      res.json({ success: false, error: e });
    });
};

router.post('/',checkRole(['administrator']), createGender);
router.get('/', checkRole(['administrator']), getAllGenders);
router.get('/current',checkRole(['administrator']), getGender);
router.put('/:id',checkRole(['administrator']), updateGender);
router.put('/:id/deactive', checkRole(['administrator']), deactivateGender);

module.exports = router;
