import rateLimit from 'express-rate-limit';


export default rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 10,
    message: 'Too many requests under a minute, try again later'
});