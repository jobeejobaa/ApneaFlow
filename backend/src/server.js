// Ensures the backend .env wins over variables already exported in the shell
const path = require('path');
require('dotenv').config({
  override: true,
  // src/ -> project root
  path: path.resolve(__dirname, '..', '.env'),
});
const app = require('./app');
const { env } = require('./config/env');

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
