
const { sequelize } = require('../config/db');
const UserModel  = require('./user.model'); 
const RoleModel = require('./role.model');

const User = UserModel(sequelize);
const Role = RoleModel(sequelize);

// Relations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

module.exports = { sequelize, User, Role };