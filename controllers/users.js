const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'verysecretjwtkey';
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

const loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не могут быть пустыми!' });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Error getting user' });
      }
    });
};

const updateUser = (req, res) => {
  console.log('upd');
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
  createUser, loginUser, getUser, getCurrentUser, getUsers, updateUser, updateAvatar,
};
