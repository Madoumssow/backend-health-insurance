const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token accsess
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Non authorisé"});
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.status !== "active") {
            return res.status(401).json({ message: "Utilisateur inactif"});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

// Vérifier les rôles de l'utilisateur
exports.requireRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès interdit" });
        }
        next();
    };
}