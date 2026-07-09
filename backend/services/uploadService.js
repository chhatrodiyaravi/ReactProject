import fs from "fs/promises";
import path from "path";

import {
  configureCloudinary,
  isCloudinaryConfigured,
} from "../config/cloudinary.js";

const toPublicPath = (filePath) => {
  const relativePath = path.relative(process.cwd(), filePath);
  return `/${relativePath.split(path.sep).join("/")}`;
};

export const resolveImageUrl = async (file, folder = "general") => {
  if (!file) {
    return "";
  }

  if (!isCloudinaryConfigured()) {
    return toPublicPath(file.path);
  }

  const cloudinary = configureCloudinary();
  const result = await cloudinary.uploader.upload(file.path, {
    folder: `foodhub/${folder}`,
    resource_type: "image",
  });

  await fs.unlink(file.path).catch(() => undefined);

  return result.secure_url;
};
