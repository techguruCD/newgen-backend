const AuthenticateRouter = require('./auth/Authenticate');

const router = require('express').Router();

router.use(AuthenticateRouter);

module.exports = router;