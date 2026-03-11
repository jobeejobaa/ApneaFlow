const express = require('express');
const cors = require('cors');
const { errorMiddleware } = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
