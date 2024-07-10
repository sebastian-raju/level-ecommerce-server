require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');



connectDB(); // connect to mongodb

const serverApp = express();

const corsOptions = {
  origin: true, // Change this to the origin(s) you want to allow.
  credentials: true, // Indicates that cookies and credentials should be included.
};
 
serverApp.use(cors(corsOptions));

// Body parser middleware
serverApp.use(express.json());
serverApp.use(express.urlencoded( { extended : true }));

// cookie parser middleware
serverApp.use(cookieParser());


serverApp.use('/api/products', productRoutes);
serverApp.use('/api/users', userRoutes);
serverApp.use('/api/orders', orderRoutes);
serverApp.use('/api/upload', uploadRoutes);

serverApp.get('/api/config/paypal', (req,res) => 
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);


const dirname = path.resolve();  
serverApp.use('/uploads', express.static(path.join(dirname, '/uploads')));


serverApp.get('*', (req, res)=>{
  res.sendFile(path.resolve(dirname, 'index.html'));
})

serverApp.use(notFound);
serverApp.use(errorHandler);


const PORT = process.env.PORT || 8000;

serverApp.listen(PORT, ()=>{
  console.log(`-----server running on PORT :: ${PORT}-----`);
})

