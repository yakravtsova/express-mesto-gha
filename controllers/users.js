const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;
const User = require('../models/user');
const { UserNotFound } = require('../errors/UserNotFound');

const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email и пароль не могут быть пустыми' });
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then(() => res.status(201).send({ message: 'Пользователь успешно создан' }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Пользователь с таким email уже существует!' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Validating error' });
      }
      return res.status(500).send({ message: 'Error creating user' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send({ message: 'Error getting user' });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send({ message: err.message });
      } else if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        res.status(400).send({ message: 'Error validating data' });
      } else {
        res.status(500).send({ message: 'Error getting user' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => {
      /* if (name.length < 2 || name.length > 30 || about.length < 2 || about.length > 30) {
        throw new ValidateError();
      } */
      res.status(200).send(user);
    })
    .catch((err) => {
      /* if (err.name === 'ValidateError' && name.length < 2) {
        res.status(err.status).send({ message: 'The name length must be more than 2 characters' });
      } else if (err.name === 'ValidateError' && name.length > 30) {
        res.status(err.status).send({ message: 'The name length must be less than 30 characters' });
      } else if (err.name === 'ValidateError' && about.length < 2) {
        res.status(400).send({ message: 'The about length must be more than 2 characters' });
      } else if (err.name === 'ValidateError' && about.length > 30) {
        res.status(400).send({ message: 'The about length must be less than 30 characters' });
      } else */ if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Validation error' });
      } else if (err.name === 'UserNotFound') {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send({ message: 'Error updating user' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { $set: { avatar } }, { new: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Error validating data' });
      } else if (err.name === 'UserNotFound') {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send({ message: 'Error updating avatar' });
      }
    });
};

module.exports = {
  createUser, getUser, getUsers, updateUser, updateAvatar,
};
