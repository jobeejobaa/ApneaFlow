const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { errorMiddleware } = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Sert les fichiers uploadés en accès public.
// Une requête GET /uploads/mon-fichier.jpg renverra le fichier depuis le dossier uploads/.
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
