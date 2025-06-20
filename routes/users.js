const express = require('express');

const { celebrate, Joi, Segments } = require('celebrate');

const router = express.Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserId);

router.post(
  '/users',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      about: Joi.string().required(),
      avatar: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

router.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      about: Joi.string().required(),
    }),
  }),
  updateProfile
);

router.get('/users/me', getUserId);

router.patch(
  '/users/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateAvatar
);

module.exports = router;
