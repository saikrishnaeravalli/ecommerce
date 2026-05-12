const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'ErrorLogger.txt');

function errorLogger(err, req, res, next) {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${err.stack || err.message}\n`;

    fs.appendFile(logFilePath, logEntry, function (writeErr) {
        if (writeErr) {
            console.error('Failed to write to error log:', writeErr.message);
        }
    });

    next(err);
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;

    res.status(statusCode).json({
        success: false,
        error: message,
    });
}

module.exports = { errorLogger, errorHandler };