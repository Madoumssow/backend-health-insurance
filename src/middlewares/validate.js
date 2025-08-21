const { body, validationResult } = require('express-validator');

// Vérification et renvoi des erreurs
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg
            }))
        });
    }
    next();
};

// Validation pour l' inscription
exports.validatorRegister = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    handleValidationErrors
];

// Validation pour la connexion
exports.validatorLogin = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .notEmpty()
        .withMessage("Password required"),
    handleValidationErrors
];

// Validation pour mise à jour profil
exports.validatorUpdateMe = [
    body("username")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email format"),
    handleValidationErrors
];

// Validation pour changement de mot de passe
exports.validatorChangePassword = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long"),
    handleValidationErrors
];

// Validation pour Admin : creation ou mise à jour d'un utilisateur
exports.validatorAdminUser = [
    body("username")
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    body("email")
        .isEmail()
        .withMessage("Valid email format required"),
    body("password")
        .optional()
        .isIn(["user", "admin"]) // contrôle des rôles valides
        .withMessage("Role must be either 'user' or 'admin'"),
    handleValidationErrors
];
