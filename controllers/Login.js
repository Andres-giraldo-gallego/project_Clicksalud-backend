const UserModel = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET = 'secret' } = process.env;

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email y contraseña son obligatorios.' });
    }

    // Buscar usuario incluyendo el password (porque lo excluimos por defecto en el modelo)
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Correo o contraseña incorrectos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Crear token con duración de 7 días
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Error en el servidor al iniciar sesión.' });
  }
};
