import rateLimit from 'express-slow-down';

const { API_VERSION, MONITORING_SERVICE_PORT } = process.env;

export default rateLimit({ // Default is 1 minute
    delayAfter: 10,
    delayMs: 500,
    maxDelayMs: 2500
});