// Load environment variables from .env file
require("dotenv").config();
require("./db/connection")();

const cors = require('cors')
const express = require("express");
const apiRouter = require("./routes/api");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;

// configure app to parse request bodies as json
app.use(express.json());
app.use(cors())

// add top level error object for managing errors across middlewares
app.use((req, _res, next) => {
  req.errors = { status: 500, messages: [] };
  return next();
});

// mount our apps routes, we add versioning to allow for preserve backwards compatability
app.use('/api', apiRouter);

//  handle all errors from the app
app.use((error, req, res, next) => {
  const { messages, status } = req.errors;
  console.error(error);
  return res
    .status(status)
    .json({
      errors: messages.length > 0 ? messages : ["internal server error"],
    });
});

app.listen(SERVER_PORT, () => {
  console.log(`Starting server on port ${SERVER_PORT}`);
});
