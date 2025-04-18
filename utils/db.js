import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// export a function that connects to db

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connect successfully");
  } catch (error) {
    console.log("Error while connecting DB",error);    
  }
}

export default db;
