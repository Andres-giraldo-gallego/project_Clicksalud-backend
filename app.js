const { Login } = require('./controllers/Login');
const { createUser } = require('./controllers/users');
const cors = require('cors');
const { celebrate, Joi, Segments } = require('celebrate');
const express = require('express');
const authMiddleware = require('./middleware/auth.js');
const { requestLogger, errorLogger } = require('./middleware/logger');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/aroundb-farmacia')
  .then(() => console.log('conectado a mongo!'))
  .catch((err) => console.log(err));

const userRouter = require('./routes/users');

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  Login
);
app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(authMiddleware);
app.use('/', userRouter);
app.get('*', (req, res) => {
  res.status(404).send('Recurso solicitado no encontrado');
});
app.use(errorLogger);
app.use((req, res) => {
  res.status(500).send({ message: 'Se ha producido un error en el servidor' });
});
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
