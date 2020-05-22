const router = require('express').Router();
const { authMiddleware } = require('../middleware');

const authController = require('./authentication_controller');
const usersController = require('./users_controller');
const rolesController = require('./roles_controller');
const personalController =  require('./personal_controller');
const genderController = require('./gender_controller');

router.get('/', (req, res) => res.send('API running'));
router.use('/auth', authController);
router.use(authMiddleware);
router.use('/users', usersController);
router.use('/roles', rolesController);
router.use('/pi', personalController);
router.use('/gender', genderController);

module.exports = router;
