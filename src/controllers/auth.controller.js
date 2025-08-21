const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const generateTokens = require('../utils/generateTokens');

exports.register = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ where: { name: 'user' }});
        const user = await User.create({ 
            username, 
            email, 
            passwordHash: hashedPassword,
            roleId: role?.id || null
        });
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user?.name || 'user',
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(400).json({ message: 'Invalid email or password' });
            }
        
            const { accessToken, refreshToken, tokenId } = generateTokens(user);
            user.refreshTokenId = tokenId;
            await user.save();

            res.cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
                sameSite: 'strict',
        }).json({ accessToken });   
        }catch (error) {
            next(error);
        }
};

exports.refresh = async (req, res, next) => {
    try {
        const token = req.cookies[process.env.REFRESH_COOKIE_NAME];
        if (!token) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user || user.refreshTokenId !== decoded.tokenId) {
            return res.status(401).json({ message: 'Refresh token is invalid' });
        } 

        const { accessToken, refreshToken, tokenId } = generateTokens(user);
        user.refreshTokenId = tokenId;
        await user.save();

        res.cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS, // Set to true if using HTTPS
            sameSite: 'strict',
        })
        .json({ accessToken });
        } catch (error) {
            next(error);
        }
};

exports.logout = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.refreshTokenId = null;
            await user.save();
        }

        res.clearCookie(process.env.REFRESH_COOKIE_NAME).json({
            message: 'Logged out successfully'
        });
    }catch (error) {
        next(error);
    }
};

exports.me = async (req, res) => {
    res.json({
            id: req.user.id, 
            email: req.user.email,
            role: req.user.roleId
    });
};