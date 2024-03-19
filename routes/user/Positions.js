const authenticate = require('../../middleware/Authenticate');

const UserPostionController = require('../../controllers/user').positions;

const router = require('express').Router();

router.get('/', authenticate, UserPostionController.getAllEntries);

module.exports = router;