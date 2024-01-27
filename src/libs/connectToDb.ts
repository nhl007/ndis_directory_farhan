import mongoose from "mongoose";

const environment = process.env.NODE_ENV;

const uri: string =
  environment === "production"
    ? (process.env.DB_PRODUCTION_URI as string)
    : (process.env.DB_LOCAl_URI as string);

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      dbName: "directory",
    });

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
