import { success } from "zod";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import { userModel } from "../models/user.model.js";
import storageInstance from "../services/storageInstance.service.js";
import appErorr from "../utils/app.Error.js";

export const getme = asyncHandler(async (req, res) => {
  const { username, fullname, email, profile_pic } = req.user;

  return res.status(200).json({
    success: true,
    message: "api fatched",
   data:{
     fullname,
    username,
    email,
    profile_pic,
   }
  });
});


export const getUsers=asyncHandler(async(req,res)=>{

const userId= req.body





  const users =await userModel.find({
    _id:{$in:userId}
  })

  
 
  

  return res.status(200).json({
    success:true,
    message:"users fatch succussfully",
    users
  })


})

export const detailUpdateController = asyncHandler(async (req, res) => {
  const { mobile_no, dob } = req.body;
  const user = req.user;

  if (mobile_no) user.mobile_no = mobile_no;
  if (dob) user.dob = dob;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "update successfully",
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const file = req.file;
  const user = req.user;

  if (!user) throw new appErorr("user not found", 404);
  if (!file) throw new appErorr("file is required", 400);

  const upload = await storageInstance(file.buffer, file.originalname);

  if (!upload) throw new appErorr("error in storage instance", 400);

  await userModel.findByIdAndUpdate(
    user._id,
    {
      profile_pic: upload.url,
    },
    {
      returnDocument: "after",
    },
  );

  return res.status(200).json({
    success: true,
    message: "profile updated successfully",
  });
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const id  = req.user._id;
  const { oldPassword, newPassword } = req.body;


  const user = await userModel.findById(id).select("password")

  const compareing = user.comparePass(oldPassword);

  if (!compareing) throw new appErorr("incorrect password", 401);

  user.password=newPassword
  await user.save()

  return res.status(200).json({
    success:true,
    message:"password change successfully"
  })

});




export const userDetailsById=asyncHandler(async(req,res)=>{
  
  const { userId } = req.body
  if(!userId) throw new appErorr("user id is required",400)

  const user=await userModel.findById(userId)

  if(!user) throw new appErorr("user not found",404)

  return res.status(200).json({
    success:true,
    message:"user details fatch successfully",
    user,
  })
})



export const sendingUsersDetails=asyncHandler(async(req,res)=>{
 
 
 
  const {serverId} = req.body


  const users = await userModel.find({
    _id:{$in:serverId}
  })
  if (!users) throw new appErorr(404,"users not found")
  

  return res.status(200).json({
    success:true,
    message:"user details fatch successfully",
    users,
  })

})