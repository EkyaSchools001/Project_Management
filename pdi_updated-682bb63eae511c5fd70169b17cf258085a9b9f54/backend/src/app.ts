import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import routes from './api/routes';
import { globalAppErrorHandler } from './api/middlewares/errorHandler';
import { globalLimiter } from './api/middlewares/security';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app: Application = express();

// Trust proxy is required for rate limiting to work correctly behind load balancers (AWS/Nginx)
app.set('trust proxy', 1);

// Middlewares
// 1. CORS – MUST be very first to handle OPTIONS preflight correctly
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder', 'bypass-tunnel-reminder', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// 2. Global Rate Limiter
app.use(globalLimiter);

// 3. Security Headers (Helmet)
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? true : false, 
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded across different origins (S3 to EC2)
    xFrameOptions: { action: 'sameorigin' },
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the frontend dist directory
// __dirname after tsc compile = /path/to/backend/dist/src
// so we go up 3 levels: dist/src -> dist -> backend -> root, then into frontend/dist
const distPath = path.join(__dirname, '../..', 'frontend', 'dist');
console.log('[Static] Serving frontend from:', distPath);
app.use(express.static(distPath));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Swagger Documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'School Growth Hub API',
            version: '1.0.0',
            description: 'API for managing educator observations and professional development',
        },
        servers: [{ url: '/api/v1' }],
    },
    apis: ['./src/api/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/v1', routes);

// Health Check
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SPA Catch-all — serve index.html for all non-API routes so React Router works
// MUST be before the global error handler
app.use((req: Request, res: Response, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return next(); // let the 404 fall through to the error handler
    }
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('[SPA] index.html not found at:', indexPath);
            res.status(404).json({ 
                status: 'fail', 
                message: 'Frontend not built. Run `npm run build` in the frontend directory.' 
            });
        }
    });
});

// Global Error Handler (must be last)
app.use(globalAppErrorHandler);

export default app;
