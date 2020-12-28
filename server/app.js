const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv/config');

const app = express();
const PORT = process.env.PORT || 5000;
const DB = process.env.DB_CONNECTION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(chalk.green.bold('Successfully connected to MongoDB'));
  })
  .catch((e) => {
    console.log(chalk.red.bold(e));
  });

app.listen(PORT, () => {
  console.log(chalk.green.bold(`Server Running on port ${PORT}`));
});
