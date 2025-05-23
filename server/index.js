import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productsRoutes.js';
import pool from './config/db.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); // Parse JSON request bodies

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', productRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Mini E-Commerce API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
