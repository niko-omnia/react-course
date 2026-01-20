const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();

const User = require('../models/user');

loginRouter.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user !== null
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

    if ((!user || !passwordCorrect)) {
        return res.status(401).json({ error: 'invalid username or password' });
    };

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET);
    res.cookie("session", token, { httpOnly: true, sameSite: "lax", secure: false });
    res.status(200).json({ token, username: user.username, name: user.name, id: user._id });
});

loginRouter.post('/api/logout', async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    return res.status(200).cookie("session", "").end();
});

module.exports = loginRouter;
