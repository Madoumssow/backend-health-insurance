const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

function generateAccessTokens(user) {
    const playload = { id: user._id, role: user.role};

    //ACCESS TOKEN
    const accessToken = jwt.sign(playload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TTL,
    });

    //REFRESH TOKEN(avec un tokenId unique)
    const tokenId = uuidv4();
    const refreshToken = jwt.sign(
        { ...playload, tokenId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TTL }
    );
    return {accessToken, refreshToken, tokenId};
}

module.exports = generateAccessTokens;