const { Sequelize } = require('sequelize');

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
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error.message);
        process.exit(1); // Quitter le processus si la connexion échoue
    }
}

module.exports = { sequelize, connectDB };
