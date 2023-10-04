const mongoose = require('mongoose');
const { MONGODB } = require('../constants'); // Replace with your actual config file path

mongoose.connect(MONGODB.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add more MongoDB options as needed
});

const db = mongoose.connection;



// Export the mongoose connection
module.exports = db;