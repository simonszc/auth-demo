'use strict';

//npm modules
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const express = require('express');
const debug = require('debug')('slugram:server');

//module constants
const PORT = process.env.PORT || 3000;
const app = express();

//app modules
const errorMiddleware = require('./lib/error-middleware');

//app routes
const authRouter = require('./route/auth-router');

//load env vars
dotenv.load();

//setup mongoose
// mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

//app middleware
app.use(cors());
app.use(morgan('dev'));

//app routes
app.use(errorMiddleware);
app.use(authRouter);

const server = module.exports = app.listen(PORT , () => {
  debug(`server up on${PORT}`);
});

server.isRunning = true;
