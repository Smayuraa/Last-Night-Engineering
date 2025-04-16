import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return !this.googleId;
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return !this.email;
    },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otp: String,
  otpExpires: Date,
  reasonToJoin: {
    type: String,
    required: true,
    enum: ["I need a project", "I want to explore notes", "I want to start learning", "Other", "Google User"],
  },
});

const User = mongoose.model("User", UserSchema);
export default User;