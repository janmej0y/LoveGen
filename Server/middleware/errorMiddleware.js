// Middleware for handling 404 Not Found errors
const notFound = (req, res, next) => {
    // Create a new error object for requests to non-existent routes
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    // Pass the error to the next middleware in the chain (our error handler)
    next(error);
};

// General error handling middleware
// This will catch any errors passed via next(error)
const errorHandler = (err, req, res, next) => {
    // Sometimes an error might come in with a 200 status code,
    // so we set it to 500 (Internal Server Error) as a default.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Send a JSON response with the error details
    res.json({
        message: err.message,
        // Include the stack trace only if the app is in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Export both middleware functions so they can be imported in server.js
module.exports = {
    notFound,
    errorHandler,
};
