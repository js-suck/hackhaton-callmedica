const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.get('/', UserController.getUsers);
router.get('/:userId/user-report', UserController.getUserReport);
router.put('/:userId/user-report', UserController.updateUserReports);

module.exports = router;