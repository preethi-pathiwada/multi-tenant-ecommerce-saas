import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dns from "dns/promises";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createJwtCookie = (res, user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const getUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
});

const isValidEmail = (email) => {
  if (!email) {
    return false;
  }

  const emailParts = email.split("@");

  if (emailParts.length !== 2) {
    return false;
  }

  const username = emailParts[0];
  const domain = emailParts[1];

  if (!username || !domain) {
    return false;
  }

  if (!domain.includes(".")) {
    return false;
  }

  return true;
};

const hasMxRecord = async (email) => {
  try {
    const domain = email.split("@")[1];

    if (!domain) {
      return false;
    }

    const records = await dns.resolveMx(domain);

    console.log("MX Records are: ", records);

    return records && records.length > 0;
  } catch (error) {
    return false;
  }
};

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    role = role || "CUSTOMER";

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters",
      });
    }

    if (name.length > 50) {
      return res.status(400).json({
        message: "Name cannot exceed 50 characters",
      });
    }

    // Simple email validation
    const emailParts = email.split("@");

    if (
      emailParts.length !== 2 ||
      !emailParts[0] ||
      !emailParts[1] ||
      !emailParts[1].includes(".")
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // PASSWORD VALIDATION

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one number",
      });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one special character",
      });
    }

    // ROLE VALIDATION

    if (!["CUSTOMER", "VENDOR"].includes(role)) {
      return res.status(400).json({
        message: "Invalid registration role",
      });
    }

    // CHECK EXISTING USER

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        return res.status(400).json({
          message:
            "An account already exists with this email but is not verified. Please verify your email or request a new verification link.",
        });
      }

      return res.status(400).json({
        message: "An account already exists with this email",
      });
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12);

    // GENERATE VERIFICATION TOKEN

    // This is the token that will be placed
    // inside the verification email URL.
    const rawToken = crypto.randomBytes(32).toString("hex");

    console.log("RAW VERIFICATION TOKEN:", rawToken);

    // We store only the hashed version in MongoDB.
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    console.log("HASHED VERIFICATION TOKEN:", hashedToken);

    // Token will expire after 24 hours.
    const tokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // -----------------------------
    // CREATE USER
    // -----------------------------

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,

      // User must verify their email first.
      isEmailVerified: false,

      // Store hashed token in database.
      emailVerificationToken: hashedToken,

      // Store token expiry time.
      emailVerificationExpires: tokenExpiry,
    });

    console.log("USER CREATED:", {
      id: user._id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationExpires: user.emailVerificationExpires,
    });

    // -----------------------------
    // CREATE VERIFICATION URL
    // -----------------------------

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

    console.log("VERIFICATION URL:", verificationUrl);

    // -----------------------------
    // SEND VERIFICATION EMAIL
    // -----------------------------

    try {
      await sendVerificationEmail(
        user.email,
        user.name,
        verificationUrl
      );

      console.log(
        "Verification email sent successfully to:",
        user.email
      );
    } catch (emailError) {
      console.error(
        "Verification email error:",
        emailError
      );

      // If email cannot be sent, remove the
      // newly created account.
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message:
          "Account could not be created because the verification email could not be sent. Please try again.",
      });
    }

    // -----------------------------
    // SUCCESS RESPONSE
    // -----------------------------

    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("\n========== EMAIL VERIFICATION ==========");
    console.log("TOKEN RECEIVED:", token);
    console.log("TOKEN LENGTH:", token?.length);

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("HASHED RECEIVED TOKEN:", hashedToken);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    console.log("USER FOUND BY TOKEN:", user ? user.email : "NO USER");

    if (user) {
      console.log("DB TOKEN:", user.emailVerificationToken);
      console.log(
        "DB EXPIRY:",
        user.emailVerificationExpires
      );
      console.log(
        "CURRENT TIME:",
        new Date()
      );
      console.log(
        "TOKEN EXPIRED:",
        user.emailVerificationExpires <= new Date()
      );
    }

    if (!user) {
      console.log("❌ NO USER MATCHED THE TOKEN");

      return res.status(400).json({
        message:
          "This verification link is invalid or has expired.",
      });
    }

    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires <= new Date()
    ) {
      console.log("❌ TOKEN HAS EXPIRED");

      return res.status(400).json({
        message:
          "This verification link is invalid or has expired.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    console.log("✅ EMAIL VERIFIED:", user.email);

    return res.status(200).json({
      message:
        "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      message: "Email verification failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified && !user.googleId) {
      return res.status(403).json({
        message:
          "Please verify your email address before logging in.",
      });
    }

    if (user.role === "VENDOR" && !user.isActive) {
      return res.status(403).json({
        message: "Your vendor account has been deactivated",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    createJwtCookie(res, user);

    res.status(200).json({
      message: "Login successful",
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email address is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account was found with this email",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "This email is already verified",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    await user.save();

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

    await sendVerificationEmail(
      user.email,
      user.name,
      verificationUrl
    );

    res.status(200).json({
      message: "A new verification email has been sent",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    res.status(500).json({
      message: "Unable to resend verification email",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || "MarketHub User";
    const emailVerified = payload.email_verified;

    if (!email || !emailVerified) {
      return res.status(400).json({
        message: "Google account email could not be verified",
      });
    }

    let user = await User.findOne({
      $or: [
        { googleId },
        { email },
      ],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        role: "CUSTOMER",
        isEmailVerified: true,
        password: undefined,
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }

      user.isEmailVerified = true;

      await user.save();
    }

    if (user.role === "VENDOR" && !user.isActive) {
      return res.status(403).json({
        message: "Your vendor account has been deactivated",
      });
    }

    createJwtCookie(res, user);

    res.status(200).json({
      message: "Google login successful",
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Google login error:", error);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      message: "Logout failed",
    });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Failed to get current user",
    });
  }
};