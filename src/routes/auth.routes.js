const express = require('express');
const router = express.Router(); 
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const errorHandler = require('../middlewares/errorHandler');
const { validatorRegister, validatorLogin } = require('../middlewares/validate');   

// POST /api/auth/register
router.post('/register', validatorRegister, authController.register); 
router.post('/login', validatorLogin, authController.login);
router.post('/logout', protect, authController.logout); 
router.get('/refresh', authController.refresh);
router.get('/me', protect, authController.me);

// Error handler
router.use(errorHandler);

module.exports = router;