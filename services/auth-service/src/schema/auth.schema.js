import { email, z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 letters"),

  username: z.string().min(2, "Name must be at least 2 letters"),

  email: z.string().email("Invalid email"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  mobile: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits").optional()
 ,
 dob:z.iso.date().optional()
});



export const loginSchema=z.object({
    email:z.string().email(10,"invalid email"),
    password:z.string().min(8,"password must be atleast 8 characters")
})



export const forgetPassword =z.object({
    email:z.string().email(10,"invalid email")
})


export const varifyOtpSchema=z.object({
   email:z.string().email(10,"invalid email"),
   otp:z.string().length(6,"invalid otp")
})



export const resetPasswordSchema=z.object({
newPasword:z.string().min(8,"Password must be at least 8 characters").regex(/^\d+$/, "OTP must contain only digits")
})