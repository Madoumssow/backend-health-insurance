// Gestion centralisée des erreurs
function errorHandler(err, req, res, next) {
    console.error(" Error:",err.stack); // Log the error stack for debugging

    // Définir le statut HTTP et le message d'erreur
    const statusCode = err.statusCode || 500;
    const message = err.message || "Erreur interne du serveur";

    // Répondre avec le statut et le message d'erreur
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
}

module.exports = errorHandler;