require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NotFoundError } = require('./errors/NotFoundError');
const { createUser, loginUser } = require('./controllers/users');
const { signUpValidators, signInValidators } = require('./utils/validators');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3001 } = process.env;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', signUpValidators, createUser);
app.post('/signin', signInValidators, loginUser);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
