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
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow localhost and requests with no origin (like mobile apps/curl)
        callback(null, true);
    },
    credentials: true,
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
app.use('/api/upload', upload_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
