const bcrypt = require('bcryptjs');

exports.getMe = async (req, res) => {
    res.json(req.user);
};

exports.updateMe = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        req.user.username = username || req.user.username;
        req.user.email = email || req.user.email;
        await req.user.save();
        res.json({ 
            message: 'User updated successfully', 
            user: req.user 
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        await req.user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.changePassord = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(oldPassword, req.user.passwordHash);

        if (!(isMatch)) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        req.user.passwordHash = await bcrypt.hash(newPassword, 10);
        await req.user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};