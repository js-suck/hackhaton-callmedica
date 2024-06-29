const express = require('express');
const router = express.Router();
const multer = require("multer");

const UserController = require('../controllers/user.controller');
const upload = multer({ dest: 'uploads/' });

router.get('/', UserController.getUsers);
router.get('/:userId/user-report', UserController.getUserReport);
router.put('/:userId/user-report', UserController.updateUserReports);
router.post('/:userId/ask', UserController.askToGpt);
router.post('/:userId/speech',  upload.single('file'), UserController.generateTranscription);
router.get('/:id/records', UserController.getRecords);

module.exports = router;