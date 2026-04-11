const colors = require('colors');

// Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.log(`Error: ${err.message}`.bgRed.white);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.DEV_MODE === 'development' ? err.stack : null,
  });
};

module.exports = { notFound, errorHandler };
