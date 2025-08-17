const {  Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

const User = require('./User')(sequelize); //importation du modèle User

// Synchronisation des modèles avec la base de données
sequelize.sync({ alter: true })// Mettre à jour les modèles(colonnes) si besoin
.then(() => 
    console.log('Modèles synchronisés avec la base de données'))// Message de confirmation
.catch((error) => 
    console.error('Erreur lors de la synchronisation des modèles:', error)
);

module.exports = { sequelize, User };