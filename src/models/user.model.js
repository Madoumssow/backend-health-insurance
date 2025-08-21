const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
        const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: [3, 30],  // Longueur minimale et maximale
                isAlphanumeric: true,  // Doit être alphanumérique
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,  
            }
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'roles',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM("active", "blocked"),
            defaultValue: "active",
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'users',                 
        });
    
        // Méthode pour comparer les mots de passe
        User.prototype.comparePassword = async function (password) {
            return await bcrypt.compare(password, this.passwordHash);
        };
        return User;
};



