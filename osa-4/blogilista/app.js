const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const blogRouter = require('./controllers/blogRouter');
const userRouter = require('./controllers/userRouter');
const loginRouter = require('./controllers/loginRouter');

logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

const app = express();
app.use(express.static('dist'));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000/",
  credentials: true
}));

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use(blogRouter);
app.use(userRouter);
app.use(loginRouter);

if (process.env.NODE_ENV === 'test') {
  console.log("Adding test routes");
  const testingRouter = require('./controllers/testing');
  app.use(testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
