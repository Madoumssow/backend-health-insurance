// scripts/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Role } = require('../src/models');

async function seedAdmin() {
    try {
        await sequelize.sync({ alter: true });

        // creer les rôles si ils n'existent pas
        const [userRole] = await Role.findOrCreate({ where: { name: 'user' } });
        const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });

        // Récupère infos admin depuis .env (fallback si non défini)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';

        // Vérifier si l'utilisateur admin existe deja
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('Admin already exists. Skipping...');
            return;
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Création de l'utilisateur admin
        await User.create({
            username: adminUsername,
            email: adminEmail,
            passwordHash: hashedPassword,
            roleId: adminRole.id
        });

        console.log(`Admin user created successfully with email: ${adminEmail} / ${adminPassword}`);
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
    } finally {
        await sequelize.close();
    }
}

seedAdmin();