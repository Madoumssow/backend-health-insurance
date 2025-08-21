const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validatorUpdateMe, validatorChangePassword } = require('../middlewares/validate');


// Toutes ces routes nécessitent un utilisateur connecté
// GET /api/users/me
router.get('/me', protect, userController.getMe);
router.put('/me', protect, validatorUpdateMe, userController.updateMe); 
router.delete('/me', protect, userController.deleteMe);
router.put('/change-password', protect, validatorChangePassword, userController.changePassord);


module.exports = router;