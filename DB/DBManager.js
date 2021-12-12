import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export function DBConnection() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB_URL, options);
    console.log("Database Connected...");
  } catch (error) {
    console.error(error);
  }
}
