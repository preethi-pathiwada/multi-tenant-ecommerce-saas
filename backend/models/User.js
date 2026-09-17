import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true, minlength: 2, maxlength: 50},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, 
        required: function () {
        return !this.googleId;
      },
    },
    googleId: {type: String, unique: true, sparse: true},
    role: {type: String, enum: ["SUPER_ADMIN", "VENDOR", "CUSTOMER"], default: "CUSTOMER"},
    isActive: {type: Boolean, default: true},
    isEmailVerified: {type: Boolean, default: false},
    emailVerificationToken: {type: String, default: null},
    emailVerificationExpires: {type: Date, default: null},
  },
  {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;