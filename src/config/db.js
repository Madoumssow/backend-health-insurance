const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // ou console.log si tu veux voir les requêtes SQL
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); // Quitter le processus si la connexion échoue
    }
}

module.exports = { sequelize, connectDB };
