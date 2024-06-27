const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.get('/', UserController.getUsers);
router.get('/:userId/user-report', UserController.getUserReport);
router.put('/:userId/user-report', UserController.updateUserReports);
router.post('/:userId/ask', UserController.askToGpt);
router.post('/:userId/speech', UserController.generateTranscription);
router.get('/:id/records', UserController.getRecords);

module.exports = router;