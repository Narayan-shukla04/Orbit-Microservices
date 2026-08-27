import asyncHandler from "../middleware/asyncHandler.middleware.js";

export const getme = asyncHandler(async (req, res) => {
  const { username, fullname, email, profile_pic } = req.user;

  return res.status(200).json({
    success: true,
    message: "api fatched",
    fullname,
    username,
    email,
    profile_pic,
  });
});

export const detailUpdateController = asyncHandler(async (req, res) => {
  const { mobile_no, dob} = req.body;
  const user = req.user;

if(mobile_no !==undefined) user.mobile_no=mobile_no
if(dob !== undefined) user.dob=dob

await user.save()


return res.status(200).json({
    success:true,
    message:"update successfully"

})



});
