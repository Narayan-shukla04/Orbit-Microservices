import z from "zod"


export const detailControllerSchema=z.object({
     mobile_no: z
        .string()
        .length(10, "Mobile number must be exactly 10 digits")
        .regex(/^\d+$/, "Mobile number must contain only digits").optional()
     ,
     dob:z.iso.date().optional() 
})



export const changePasswordSchema=z.object({
    oldPassword:z.string()
    , newPassword :z.string().min(8,"password must be atleast 8 characters")
})