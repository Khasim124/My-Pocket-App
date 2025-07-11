const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const createError = require('http-errors');

require('./config/passport')(passport);
const { sequelize } = require('./model/User_details');
const userRoutes = require('./routes/user_routers');
const todoRoutes = require('./routes/todo_routers');

const app = express();

sequelize.authenticate()
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true })
    .then(() => console.log("✅ Tables synced (dev only)"))
    .catch(err => console.error("❌ Sync Error:", err));
}

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/userdetails", userRoutes);
app.use("/todos", todoRoutes);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
