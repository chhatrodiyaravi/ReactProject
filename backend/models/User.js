import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "owner"],
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockReason: {
    type: String,
    trim: true,
  },
  blockedAt: Date,
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for admin queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Block user
userSchema.methods.block = async function (reason, adminId) {
  this.isBlocked = true;
  this.blockReason = reason;
  this.blockedAt = new Date();
  this.blockedBy = adminId;
  return await this.save();
};

// Unblock user
userSchema.methods.unblock = async function () {
  this.isBlocked = false;
  this.blockReason = null;
  this.blockedAt = null;
  this.blockedBy = null;
  return await this.save();
};

// Check if account is locked
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > new Date();
};

// Update login attempts
userSchema.methods.updateLoginAttempts = async function (isSuccessful) {
  if (isSuccessful) {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLogin = new Date();
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
    }
  }
  return await this.save();
};

export default mongoose.model("User", userSchema);
