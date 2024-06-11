const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals')
const users = require("./routes/user")
const express = require('express');
const app = express();
const auth = require('./routes/auth')
const config = require('config')
const error = require('./middleware/error')
const winston = require('winston')
require('winston-mongodb')

process.on('uncaughtException', (ex) => {
  console.log('WE GOT AN UNCAUGHT EXCEPTION')
  winston.error(ex.message, ex)
})

// Create a Winston transport instance
const fileTransport = new winston.transports.File({ filename: 'somefile.log' });

// Add the transport to Winston
winston.add(fileTransport);

const mongoTransport = new winston.transports.MongoDB({
  db: 'mongodb://localhost/vidly',
  level: 'info'
})

winston.add(mongoTransport)

// throw new Error('Something failed during startup.')

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1)
}

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.use(error)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/routes/test.html')
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));