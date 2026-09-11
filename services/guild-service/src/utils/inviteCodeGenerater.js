import crypto from "crypto";

const inviteCodeGenerater=()=>{
    

    return crypto.randomBytes(16).toString("hex")
}

export default inviteCodeGenerater