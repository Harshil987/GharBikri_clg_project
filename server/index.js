const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const db = require("./db");

// middleware

app.use(express.json()) // req.body
app.use(express.urlencoded({ extended: true })) // req.body

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
const SERVER_PORT=process.env.SERVER_PORT
// routes
 const routes = require('./routes');
app.use('/api',routes);    

const startServer = () => {
    try {
        app.listen(SERVER_PORT, () => {
            
            console.log(`Real Estate server listening on port ${SERVER_PORT}`);
        })
    } catch (e) {
        console.error(`Error: ${e}`);
    }


    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
};



startServer();
