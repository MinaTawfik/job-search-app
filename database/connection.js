import mongoose from "mongoose";

export const connection = async()=>{
  try {
    await mongoose.connect(process.env.CONNECTION_DB_URI);
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
