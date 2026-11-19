import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

let imagekit = null;

const getImageKit = () => {
  if (imagekit) return imagekit;
  if (!process.env.IK_PUB_KEY || !process.env.IK_PRI_KEY || !process.env.IK_ENDPOINT) {
    return null;
  }
  imagekit = new ImageKit({
    publicKey: process.env.IK_PUB_KEY,
    privateKey: process.env.IK_PRI_KEY,
    urlEndpoint: process.env.IK_ENDPOINT,
  });
  return imagekit;
};

const storageInstance = async (file, fileName) => {
  const ik = getImageKit();
  if (!ik) {
    return { url: "" };
  }
  return await ik.upload({
    file,
    fileName,
    folder: "discord",
  });
};

export default storageInstance;
