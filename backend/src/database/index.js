import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
    console.log("database connected");
  } catch (err) {
    console.log("database connection error", err.message);
    process.exit(1);
  }
};

export { connectDB };
