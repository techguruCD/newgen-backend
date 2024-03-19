const AuthController = require('../../controllers/auth');
const { validateRegisterRequest, validateLoginRequest } = require('../../validators/AuthenticatValidator');

const router = require('express').Router();

router.post('/register', validateRegisterRequest, AuthController.register);
router.post('/login', validateLoginRequest, AuthController.login);
router.put('/addBalance', AuthController.addBalance);

module.exports = router;