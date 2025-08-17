const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
        const User = sequelize.define('User', {
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
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
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


