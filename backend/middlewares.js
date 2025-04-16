import {
  contactValidationSchema,
  noteValidationSchema,
  projectValidationSchema,
  teachingValidationSchema,
  userValidationSchema
} from "./models/schemavalidate.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

export const validateContact = (req, res, next) => {
  const { error } = contactValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    console.log("yappa", error);
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export const validateNote = (req, res, next) => {
  const { error } = noteValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export const validateProject = (req, res, next) => {
  const { error } = projectValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export const validateTeaching = (req, res, next) => {
  const { error } = teachingValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token", error: error.message });
  }
};

export const isAdmin = (req, res, next) => {
  const adminGoogleIds = process.env.ADMIN_GOOGLE_IDS.split(',');
  console.log(adminGoogleIds);
  if (!req.user?.googleId) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized: Please log in with Google" 
    });
  }
  if (!adminGoogleIds.includes(req.user.googleId)) {
    return res.status(403).json({ 
      success: false, 
      message: "Forbidden: You don't have admin privileges" 
    });
  }
  next();
};