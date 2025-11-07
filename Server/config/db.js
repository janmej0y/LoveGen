const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Options to avoid deprecation warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Log a success message if the connection is established
        console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error and exit the process if the connection fails
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit with a failure code
    }
};

// Export the connectDB function so it can be used in other files
module.exports = connectDB;
