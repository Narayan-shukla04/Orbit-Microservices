import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}

export default authMiddleware
