const router = require('express').Router();
const _ = require('lodash');
const PersonalInformation = require('../models/Personal');
const checkRole = require('../middleware').checkRole;
const {verifyAgeAutomatic, verifyAgeManual}  = require('../helpers/verifyAge');
const {setPrefix}  = require('../helpers/setPrefix');

const getAllPersonalInformations = (req, res) => {
   PersonalInformation
    .find({pi_active: true})
    .populate("pi_gender")
    .then((personalInformation) => {        
      res.send(personalInformation);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar información',
      });
    });
};

const getPersonalInformation = (req, res) => {
   PersonalInformation
    .findById(req.personalinformation.id)
    .populate("pi_gender")
    .then((personalInformation) => {
      if (!personalInformation) {
        return res.status(404).send({
          message: `Informacion no encontrada id: ${req.personalinformation.id}`,
        });
      }
      res.send({ role });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al recuperar información',
      });
    });
};

const createPersonalInformation = (req, res) => {
  const genderId = req.body.pi_gender;
  const age = verifyAgeAutomatic(req.body.pi_birthdate);
  const isMarried = req.body.pi_married_lastname !== "" ||  req.body.pi_married_lastname; 
  const isAdult = age > 18;
  const pi_prefix = setPrefix(age, genderId, isMarried);

  const personalInformation = new PersonalInformation({
    pi_prefix:  pi_prefix,
    pi_first_name: req.body.pi_first_name,
    pi_second_name: req.body.pi_second_name,
    pi_first_surname: req.body.pi_first_surname,
    pi_second_surname: req.body.pi_second_surname,  
    pi_married_lastname: req.body.pi_married_lastname,
    pi_DUI: req.body.pi_DUI,
    pi_NIT: req.body.pi_NIT,
    pi_birthdate: req.body.pi_birthdate,
    pi_is_adult: isAdult,
    pi_phone: req.body.pi_phone,
    pi_address: req.body.pi_address,
    pi_email: req.body.pi_email,
    pi_gender: genderId,
    pi_active: true,
  });

  personalInformation.save()
    .then((response) => {
      response.populate("gi_gender").execPopulate()
      const fullname = `${response.pi_prefix} ${response.pi_first_name} ${response.pi_second_name} ${response.pi_first_surname} ${response.pi_second_surname}`;
      res.send({personalInfo: response, success: true, fullname });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error guardando información' });
    });
};

const updatePersonalInformation = (req, res) => {
    const genderId = req.body.pi_gender;
    const age = verifyAgeAutomatic(req.body.pi_birthdate);
    const isMarried = req.body.pi_married_lastname !== "" ||  req.body.pi_married_lastname; 
    const isAdult = age > 18;
    const pi_prefix = setPrefix(age, genderId, isMarried);

  const personalInformation = {
      
    pi_prefix:  pi_prefix,
    pi_first_name: req.body.pi_first_name,
    pi_second_name: req.body.pi_second_name,
    pi_first_surname: req.body.pi_first_surname,
    pi_second_surname: req.body.pi_second_surname,  
    pi_married_lastname: req.body.pi_married_lastname,
    pi_DUI: req.body.pi_DUI,
    pi_NIT: req.body.pi_NIT,
    pi_birthdate: req.body.pi_birthdate,
    pi_is_adult: isAdult,
    pi_phone: req.body.pi_phone,
    pi_address: req.body.pi_address,
    pi_email: req.body.pi_email,
    pi_gender: genderId,
  };

  PersonalInformation.findByIdAndUpdate({_id: req.params.id}, personalInformation, { new: true })
    .populate("pi_gender")
    .then((response) => {
      if (!response) {
        return res.status(404).send({ message: `No encontrado id: ${req.params.id}` });
      }
      const fullname = `${response.pi_prefix} ${response.pi_first_name} ${response.pi_second_name} ${response.pi_first_surname} ${response.pi_second_surname}`;
      res.send({personalInfo: response, success: true, fullname });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || 'Error actualizando su información' });
    });
};

const deactivatePersonalInformation = (req, res) => {
  const { id } = req.params;
  PersonalInformation
    .findByIdAndUpdate({_id: id}, { pi_active: false }, {new: true})
    .populate("pi_gender")
    .then((response) => {
        if (!response) {
            return res.status(404).send({ message: `No encontrado id: ${id}` });
        }
        res.json({ success: true, personalInformation: response });
    })
    .catch((e) => {
      res.json({ success: false, error: e });
    });
};

router.post('/', checkRole(['administrator']), createPersonalInformation);
router.get('/', checkRole(['administrator']), getAllPersonalInformations);
router.get('/current', checkRole(['administrator']), getPersonalInformation);
router.put('/:id', checkRole(['administrator']), updatePersonalInformation);
router.put('/:id/deactive', checkRole(['administrator']), deactivatePersonalInformation);

module.exports = router;
