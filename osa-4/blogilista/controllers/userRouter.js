const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.post('/api/users', async (req, res) => {
    const { username, name, password } = req.body;
    if (!username || !name || !password) return res.sendStatus(400);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();
    return res.status(201).json(savedUser);
});

usersRouter.get('/api/users', async (req, res) => {
  const users = await User.find({})
  return res.json(users)
})

module.exports = usersRouter;
