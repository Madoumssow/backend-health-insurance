const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

// Verify JWT token accsess
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not allowed"});
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Récupère l’utilisateur et son rôle
        const user = await User.findById(decoded.id, {
            include: {
                model: Role,
                as: "role",
            },
        });
        
        if (!user || user.status !== "active") {
            return res.status(401).json({ message: "Inactive user"});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Vérifier les rôles de l'utilisateur
exports.requireRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role.name)) {
            return res.status(403).json({ message: "Access prohibited" });
        }
        next();
    };
}