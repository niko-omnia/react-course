const router = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

router.post('/api/testing/reset', async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  res.sendStatus(204);
});

module.exports = router;
