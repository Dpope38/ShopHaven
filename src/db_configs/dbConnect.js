/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.URL);
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.log(error);
//   }
// };

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      family: 4,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      ssl: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
