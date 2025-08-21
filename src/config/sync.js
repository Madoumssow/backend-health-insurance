const { sequelize } = require('./db');
const Role = require('../models/role.model');
const User = require('../models/user.model');

async function syncDB() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error.message);
    }
}

syncDB();