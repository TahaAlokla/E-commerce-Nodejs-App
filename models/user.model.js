const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "username is Required"],
      minlength: [2, "username minimum length 2 characters"],
      maxlength: [100, "Brand name maximum length 100 characters"],
    },
    email: {
      type: String,
      required: [true, "email is Required"],
      unique: [true, "email name is unique"],
    },
    phone: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is Required"],
      minlength: [6, "password minimum length 6 characters"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpiresAt: Date,
    passwordResetCodeVerify: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    slug: {
      type: String,
      lowercase: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// working with createUser only
UserSchema.pre("save", async function (next) {
  // Only run this function if password was moddified (not on other update functions)
  if (!this.isModified("password")) return next();
  // Hash password with strength of 12
  this.password = await bcrypt.hash(this.password, 12);
});
const UserModal = mongoose.model("User", UserSchema);
module.exports = UserModal;
