import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const jwtToken =
      req.cookies.jwt ||
      req.headers.authorization?.split(" ")[1];

    if (!jwtToken) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role === "VENDOR" && !user.isActive) {
      return res.status(403).json({
        message: "Your vendor account has been deactivated",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not authorized to access the resource",
      });
    }

    next();
  };
};