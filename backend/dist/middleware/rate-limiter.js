import rateLimit from "express-rate-limit";
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100, // Limit each IP to 100 requests per `window` (here, per minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after a minute."
    }
});
//# sourceMappingURL=rate-limiter.js.map