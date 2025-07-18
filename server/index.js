import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import beauty from './routes/Beauty.route.js';
import book from './routes/bookshop.route.js';
import cloth from './routes/cloth.route.js';
import product from './routes/product.rotue.js';
import promotionRoute from './routes/Promotion.route.js';
import authRoute from './routes/Auth.route.js';
import shopRoute from './routes/Shop.route.js';
import itemRoute from './routes/Item.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

console.log('Server starting...');

const app = express();

// CORS configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Increase payload size limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Start server first
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// Routes
app.use('/api/beauty', beauty);
app.use('/api/book', book);
app.use('/api/cloth', cloth);
app.use('/api/product', product);
app.use('/api/promotion', promotionRoute);
app.use('/api/auth', authRoute);
app.use('/api/shops', shopRoute);
app.use('/api/item', itemRoute);

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
});

// Connect to MongoDB after server starts
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.log('MongoDB connection error:', err.message);
    console.log('Please check:');
    console.log('1. Internet connection');
    console.log('2. MongoDB Atlas cluster status');
    console.log('3. Database credentials');
    console.log('4. IP whitelist in MongoDB Atlas');
    console.log('Server will continue running without database connection...');
});