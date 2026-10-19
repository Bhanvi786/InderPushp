"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const artwork_routes_1 = __importDefault(require("./routes/artwork.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const aboutSettings_routes_1 = __importDefault(require("./routes/aboutSettings.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
// Trust first proxy (Render / Cloudflare / reverse proxy) for accurate IP resolution in rate limiting
app.set('trust proxy', 1);
// Security Headers (Lightweight & zero overhead)
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});
// Explicit CORS Allowlist
const ALLOWED_ORIGINS = [
    'https://inderpushphouseofart.com',
    'https://www.inderpushphouseofart.com',
    'http://localhost:3000',
    'http://localhost:3001',
];
// Helper to validate verified Vercel preview URLs strictly for this project
const isAllowedVercelOrigin = (origin) => {
    // Allow inder-pushp-*.vercel.app or exact inderpushp vercel domains
    return /^https:\/\/(inder-pushp|inderpushp)(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
};
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) {
            return callback(null, true);
        }
        if (ALLOWED_ORIGINS.includes(origin) || isAllowedVercelOrigin(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the InderPushp API!',
        timestamp: new Date().toISOString(),
    });
});
// Mount Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/artworks', artwork_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/about-settings', aboutSettings_routes_1.default);
app.use('/api/contact', contact_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
// Centralized error handling middleware with production sanitization
app.use((err, req, res, _next) => {
    console.error('[Unhandled Server Error]:', err.message || err);
    const status = typeof err.status === 'number' ? err.status : 500;
    // Never leak stack traces or internal DB errors to public API in production
    const safeMessage = status < 500 || process.env.NODE_ENV !== 'production'
        ? err.message || 'Operation failed'
        : 'An unexpected internal error occurred. Please try again later.';
    res.status(status).json({
        success: false,
        message: safeMessage,
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
