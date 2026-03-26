const mongoose = require('mongoose');

//Conexion to MongoDB database

const connectDB = async () => {
    try {
        //
        await mongoose.connect(process.env.DB_URL);
        console.log('Succeesful connection ❤️‍🔥');
    } catch (error) {
        console.log(`🚨 Error connection MongoDB ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;