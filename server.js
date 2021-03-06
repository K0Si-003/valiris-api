require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
const extractClientLanguage = require('./middlewares/extractClientLanguage');
const extractToken = require('./middlewares/extractToken');

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 3000);

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', error => {
  console.log('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((err) => {
    if (err) console.error(JSON.stringify(err), err.stack);
  });
});

// middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/show-uploads-dir', (req, res) => {
  // requiring path and fs modules
  const path = require('path');
  const fs = require('fs');
  // joining path of directory
  const directoryPath = path.join(__dirname, 'uploads');
  // passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    // handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    res.send(files);
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(extractClientLanguage);
app.use('/contacts', require('./routes/contact.routes.js'));
app.use('/apartments', require('./routes/apartment.routes.js'));
app.use('/bookings', require('./routes/booking.routes.js'));

app.use(extractToken);
app.use('/users', require('./routes/user.routes.js'));
app.use('/auth', require('./routes/auth.routes.js'));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
});
app.set('x-powered-by', false);

app.use(extractToken);
app.use('/users', require('./routes/user.routes.js'));
app.use('/auth', require('./routes/auth.routes.js'));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
});
app.set('x-powered-by', false);

// set port, listen for requests
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Server running on port ' + PORT);
  }
});

module.exports = server;
