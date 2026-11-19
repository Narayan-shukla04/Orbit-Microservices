import jwt from "jsonwebtoken";

// const publicRouts = ["api/auth/login", "api/auth/register", "api/auth/refresh"];

export const verifyToken = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - token missing",
      });
    }

    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }

    req.headers.user = decode.id;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
