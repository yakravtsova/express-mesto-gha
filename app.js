const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Page is not found' });
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Пользователь с таким email уже существует!' });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
