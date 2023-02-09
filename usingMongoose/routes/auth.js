const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.get('/', authController.getIndex);

router.get('/login', authController.getIndex);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/recover', authController.getRecover);

router.post('/recover', authController.postRecover);

router.get('/reset/:token', authController.getReset);

router.post('/reset', authController.postReset);

module.exports = router;