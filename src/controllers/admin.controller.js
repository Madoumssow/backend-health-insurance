const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ include: Role });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const roleRecord = await Role.findOne({ where: { name: role || 'user' } });
        const user = await User.create({
            username, 
            email, 
            passwordHash: password, 
            roleId: roleRecord?.id || null
        });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email, role, status } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.status = status || user.status;

        if (role) {
            const roleRecord = await Role.findOne({ where: { name: role } });
            if (roleRecord) user.roleId = roleRecord.id;
        }

        await user.save();
        res.json(user);
        
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
        
    } catch (error) {
        next(error);
    }
};