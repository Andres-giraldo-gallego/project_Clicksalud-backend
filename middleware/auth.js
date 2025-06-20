// Middleware para autenticar
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret'; // Usa variable de entorno si está disponible

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica que el encabezado Authorization exista y comience con "Bearer "
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return res
      .status(403)
      .json({ error: 'No autorizado: encabezado faltante o inválido' });
  }
  console.log(authHeader);
  const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
  console.log(token);
  if (!token) {
    return res
      .status(403)
      .json({ error: 'No autorizado: token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY); // Verifica y decodifica el token
    req.user = payload; // Añade el payload al objeto req
    console.log(payload);
    next(); // Continúa con el siguiente middleware o controlador
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
