"use server";

import cloudinary from "cloudinary";

const cloud = cloudinary.v2;

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: string) => {
  try {
    const res = await cloud.uploader.upload(file, {
      upload_preset: "noteapp",
      unique_filename: true,
      format: "webp",
    });

    // return { url: res.secure_url, id: res.public_id };

    return res.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteImage = async (id: string) => {
  const res = await cloud.uploader.destroy(id);
};
