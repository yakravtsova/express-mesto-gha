const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {PageNotFound} = require('./errors/errors');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());


app.use((req, res, next) => {
  req.user = {
    _id: '62f6bc001bb256ef290f550e'
  };

  next();
});


app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', (req, res) => {
 // res.status(404).send({message: "Страница не существует"});
 //console.log('ОЛОЛО');
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});