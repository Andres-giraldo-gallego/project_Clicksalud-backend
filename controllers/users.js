const UserModel = require('../models/user.js');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).send('Ha ocurrido un error en el servidor');
  }
};

const getUserId = async (req, res) => {
  console.log(req.user._id);
  try {
    const faintUser = await UserModel.findById(req.user._id).orFail();
    return res.json(faintUser);
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: 'ID de usuario no encontrado' });
    }
    console.log(error);
    return res.status(500).send({ message: 'Error al buscar usuario', error });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email y contraseña son obligatorios.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name, // si es undefined, el valor por defecto del esquema se usará
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // No devolver la contraseña
    const userToReturn = savedUser.toObject();
    delete userToReturn.password;

    return res.status(201).json(userToReturn);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send('Se pasaron datos inválidos al crear un usuario.');
  }
};

const updateProfile = async (req, res) => {
  const { name, about } = req.body;
  console.log(req.user);
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      { new: true }
    ).orFail();

    return res.send(updateUser);
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    return res
      .status(500)
      .send({ message: 'Error al actualizar el perfil', error });
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  console.log('avatar', req.user._id);
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      { new: true }
    ).orFail();

    return res.send(updateUser);
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    return res
      .status(500)
      .send({ message: 'Error al actualizar el avatar', error });
  }
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
};
