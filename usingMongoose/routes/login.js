const express = require('express');

const loginController = require('../controllers/login');

const router = express.Router();

router.get('/', loginController.getIndex);

router.get('/login', loginController.getIndex);

router.post('/login', loginController.postLogin);

module.exports = router;