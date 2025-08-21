const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, requireRoles } = require('../middlewares/auth.middleware');
const { validatorAdminUser } = require('../middlewares/validate');

// Toutes ces routes sont réservées aux admins
// GET /api/admin/users
router.get('/users', protect, requireRoles("admin"), adminController.getAllUsers);
router.post('/users', protect, requireRoles("admin"), validatorAdminUser, adminController.createUser);
router.put('/users/:id', protect, requireRoles("admin"), validatorAdminUser, adminController.updateUser);
router.delete('/users/:id', protect, requireRoles("admin"), adminController.deleteUser); 


module.exports = router;