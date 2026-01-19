const jwt = require("jsonwebtoken");
require("dotenv").config();

const logger = require('./logger');
const User = require("../models/user");

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);
    } else {
        req.token = null;
    }
    next();
};

async function getUserFromToken(token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.id) return null;
    return await User.findById(decodedToken.id) || null;
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    getUserFromToken
};
