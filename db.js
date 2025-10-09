const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      maxPoolSize: 10  
      });
    console.log("Mongodb Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};
module.exports = connectDB;
