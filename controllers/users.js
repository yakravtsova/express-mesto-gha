const User = require('../models/user');
const mongoose = require('mongoose');
const { UserNotFound, ValidationError } = require('../errors/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => {
      if (err.name === "ValidationError") {
        res.status(err.status).send({ message: err.message });
        return;
      }
      else if (name.length < 2 || name.length > 30 || !(name && about && avatar)) {
        throw new ValidationError();
      }
      res.status(201).send(user)})
    .catch(err => {
      if (err.name === "ValidationError" && name.length < 2) {
        res.status(err.status).send({ message: "The name length must be more than 2 characters" });
        return;
      }
      else if (err.name === "ValidationError" && name.length > 30) {
        res.status(err.status).send({ message: "The name length must be less than 30 characters" });
        return;
      }
      else {
        res.status(500).send({ message: "Error creating user" })
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(users => res.status(200).send(users))
    .catch(err => {
      if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message);
        return;
      }
      else {
        res.status(500).send({ message: "Error getting user" })
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === "UserNotFound") {
        res.status(err.status).send({message: err.message});
        return;
      }
      else if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        res.status(400).send({ message: "Error validating data" });
        return;
      }
      else {
        res.status(500).send({ message: "Error getting user" });
      }
    });
}

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {$set: { name: name, about: about }}, { new: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(user => {
      if (name.length < 2 || name.length > 30) {
        throw new ValidationError();
      }
      res.status(200).send(user);
    })
    .catch(err => {
      if (err.name === "ValidationError" && name.length < 2) {
        res.status(err.status).send({ message: "The name length must be more than 2 characters" });
        return;
      }
      else if (err.name === "ValidationError" && name.length > 30) {
        res.status(err.status).send({ message: "The name length must be less than 30 characters" });
        return;
      }
      else if (err.name === "ValidationError") {
        res.status(err.status).send({ message: err.message });
        return;
      }
      else if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message);
        return;
      }
      else {
        res.status(500).send({ message: "Error updating user" })
      }
    });
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error validating data" })
      }
      else if (err.name === "UserNotFound") {
        res.status(err.status).send(err.message)
      }
      else {
        res.status(500).send({ message: "Error updating avatar" })
      }
    });
}

module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar };