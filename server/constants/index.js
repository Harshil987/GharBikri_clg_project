const { config } = require('dotenv');
config();  // Load .env file into process.env object

exports.MONGODB = {
    MONGODB_URI: process.env.MONGODB_URI
};
exports.SERVER = {
    SERVER_PORT: process.env.SERVER_PORT
}

exports.JWT = {
    JWT_SECRET: process.env.JWT_SECRET
    
}