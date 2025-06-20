const mongoose = require('mongoose');
const validator = require('validator');

const urlRegex =
  /^(https?:\/\/)(www\.)?[\w.-]+\.[a-z]{2,6}(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?#?$/i;

const newUserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    min: 2,
    max: 30,
  },
  about: {
    type: String,
    default: 'Explorador',
    min: 2,
    max: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'email invalido',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
    min: 6,
    max: 30,
  },

  avatar: {
    type: String,
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator(value) {
        return urlRegex.test(value);
      },
      message:
        '⚠️ La URL del avatar no es válida. Asegúrate de que comience con http:// o https://',
    },
  },
});

module.exports = mongoose.model('user', newUserSchema);
