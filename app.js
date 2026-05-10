require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const readline = require('readline');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: 'recipe-roulette' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./routes/index');
const savedRouter = require('./routes/saved');

app.use('/', indexRouter);
app.use('/saved', savedRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Readline prompt after server starts
  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Stop to shutdown the server: '
  });

  read.prompt();

  read.on('line', (line) => {
    if (line.trim().toLowerCase() === 'stop') {
      console.log('Shutting down the server');
      process.exit(0);
    } else {
      read.prompt();
    }
  });
});