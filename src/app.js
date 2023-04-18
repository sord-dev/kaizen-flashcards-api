const express = require('express');
const createError = require('http-errors');
const cardRouter = require("./routes/card");
const deckRouter = require("./routes/deck");
const userRouter = require("./routes/user");
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors())

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use("/deck",deckRouter)
app.use("/card", cardRouter)
app.use("/user",userRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports = app;