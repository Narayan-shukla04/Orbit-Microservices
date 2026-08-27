import asyncHandler from "../middleware/asyncHandler.middleware.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import storageInstance from "../services/storageInstance.service.js";
import appErorr from "../utils/app.Error.js";
import generateToken from "../utils/token.js";
import redis from "../config/redis.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcrypt";

export const registerController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, dob, mobile_no } = req.body;

  const file = req.file;

  if (!fullname || !username || !email)
    throw new appErorr("fullname, username and email are required", 400);

  const user = await userModel.create({
    fullname,
    username,
    email,
    password,
    dob,
    mobile_no,
    profile_pic: file
      ? (await storageInstance(file.buffer, file.originalname)).url
      : null,
  });

  const accessToken = await generateToken(user._id, "30min");
  const refreshToken = await generateToken(user._id, "7d");

  res.cookie("accessToken", accessToken, {
    http: true,
    secure: false,

    sameSite: "strict",
    expiresIn: 30 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    http: true,
    secure: false,

    sameSite: "strict",
    expiresIn: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "user registered successfully",
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new appErorr("both fields are required", 400);

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) throw new appErorr("user not found register first", 404);

  if (!user.password || user.authProvider === "google")
    return res.status(400).json({
      success: false,
      message: "continue with Google",
    });

  const isPassCorrect = user.comparePass(password);

  console.log(isPassCorrect);

  if (!isPassCorrect) throw new appErorr("invalid credentials", 401);

  const accessToken = await generateToken(user._id, "30min");
  const refreshToken = await generateToken(user._id, "7d");

  res.cookie("accessToken", accessToken, {
    http: true,
    secure: false,

    sameSite: "strict",
    expiresIn: 30 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    http: true,
    secure: false,

    sameSite: "strict",
    expiresIn: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "user registered successfully",
  });
});

export const googleAuth = (req, res, next) => {
  // Handled directly by passport middleware in routes
};

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { sub, name, given_name, picture, email } = req.user._json;

  console.log(req.user);

  const user = await userModel.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    const accessToken = generateToken(user._id, "30min");
    const refreshToken = generateToken(user._id, "7d");

    res.cookie("accessToken", accessToken, {
      http: true,
      secure: false,

      sameSite: "strict",
      expiresIn: 30 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      http: true,
      secure: false,

      sameSite: "strict",
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "user loggin successfully by google",
    });
  }

  const newUser = await userModel.create({
    username: name,
    fullname: given_name,
    email: email,
    profile_pic: picture,
    googleId: sub,
    authProvider: req.user.provider,
  });

  const accessToken = generateToken(newUser._id, "30min");
  const refreshToken = generateToken(newUser._id, "7d");

  res.cookie("accessToken", accessToken, {
    http: true,
    secure: false,

    sameSite: "strict",
    expiresIn: 30 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    http: true,
    secure: false,

    sameSite: "strict",
    expiresIn: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "user created successfully by google",
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  await redis.set(
    `berrar:cookie-${req.user.id}`,
    hashToken,
    "EX",
    7 * 24 * 60 * 60,
  );
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "user logout successfully",
  });
});

export const testController = asyncHandler(async (req, res) => {
  console.log("hello i am test");
});

export const forgatPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new appErorr("email is required", 400);

  const user = await userModel.findOne({ email });

  if (!user) throw new appErorr("user not found", 404);

  const otp = (Math.floor(Math.random() * 100000) + 100000).toString();

  const hashedOtp = bcrypt.hashSync(otp, 10);

  await redis.set(`hashedOtp-${email}`, hashedOtp, "EX", 10 * 60 * 60);

  await sendEmail(
    user.email,
    "Reset Your Discord Password",
    `Reset your password using this otp: `,
    `
        <h2>Reset Your OTP</h2>
        <h3>${otp}</h3>

       

        <p>This link expires in 10 minutes.</p>
    `,
  );

  return res.status(200).json({
    success: true,
    message: "otp send to your email",
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email) throw new appErorr("email are required", 400);

  const storedOTP = await redis.get(`hashedOtp-${email}`);

  const unhash = bcrypt.compareSync(otp, storedOTP);

  if (!unhash) throw new appErorr("invalid otp", 401);

  const accessToken = await generateToken({ email }, "10min");

  res.cookie("sessionToken", accessToken, {
    // httpOnly: true,
    secure: false,
    expiresIn: 10 * 60 *60* 1000,
  });

  return res.status(200).json({
    success: true,
    message: "otp verifyed",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPasword } = req.body;
  const token = req.cookies.sessionToken;

  if (!newPasword) throw new appErorr("pasword are required", 400);
  if (!token) throw new appErorr("unauthrized", 401);



  const decode = jwt.verify(token, process.env.JWT_SECRET);

  if (!decode) throw new appErorr("invalid token", 401);


  const email = decode.id.email;
  const user = await userModel.findOne({ email }).select("password");

  if (!user) throw new appErorr("user not found", 404);

  user.password = newPasword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "password reset successfully",
  });
});
