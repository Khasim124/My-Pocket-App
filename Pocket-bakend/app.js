const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const createError = require('http-errors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

//  Passport configuration
require('./config/passport')(passport);

//  Database connection
const sequelize = require('./config/db');

// Test DB connection
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection error:", err));

//  Sync models in non-production 
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }) 
    .then(() => console.log("✅ Database synced"))
    .catch(err => console.error("❌ Sync error:", err));
}

//  Middleware setup
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3001", 
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

//  Routes
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

app.use("/userdetails", userRoutes); 
app.use("/todos", todoRoutes);

//  Error Handling
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
