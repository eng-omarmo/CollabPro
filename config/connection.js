const mongoose = require('mongoose');
const colors = require('colors'); 

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log(`Successfully connected to MongoDB`.yellow);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`.red); 
    }
};

module.exports = connectDB;
