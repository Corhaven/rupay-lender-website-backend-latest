const mongoose = require("mongoose");

// The connection string embeds the database password, so log the host only —
// otherwise every startup writes the credentials into the server logs.
const dbHost = (url = "") => {
  try {
    return new URL(url).host;
  } catch {
    return "(unreadable host)";
  }
};

const connectDB = async () => {
  console.log("Connecting to MongoDB...", dbHost(process.env.MONGO_URL));
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
