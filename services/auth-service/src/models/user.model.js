import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    trim: true,
  },
  fullname: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    sparse: true,
    trim: true,
    maxlength: 15,
    minlength:8,
    select:false
  },
  dob: {
    type: Date,
  },
  mobile_no: {
    type: Number,
    trim: true,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ["google", "local"],
    default: "local",
  },
  googleId:{
    type:String,
    sparse:true,
    unique:true
  },

  profile_pic: {
    type: String,
    sparse: true,
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "servers",
  },
  friends: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
},{timeseries:true});


userSchema.pre("save", function (){
  if(! this.password || ! this.isModified("password")) return 

  this.password = bcrypt.hashSync(this.password,10)

})

userSchema.methods.comparePass = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};


export const userModel= mongoose.model("users",userSchema)
