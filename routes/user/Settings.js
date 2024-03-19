const authenticate = require('../../middleware/Authenticate');

const UserSettingsController = require('../../controllers/user').settings;

const router = require('express').Router();

router.put('/', authenticate, UserSettingsController.updateUser);
router.delete('/', authenticate, UserSettingsController.deleteUser);

module.exports = router;