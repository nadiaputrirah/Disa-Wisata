const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

let userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters long"],
      maxlength: [50, "Full name must be at most 50 characters long"],
    },

    customer_id: {
      type: Number,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: [3, "Email must be at least 3 characters long"],
      maxlength: [255, "Email must be at most 50 characters long"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters long"],
      maxlength: [255, "Password must be at most 50 characters long"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    token: [String],
  },
  { timestamps: true }
);

userSchema.path("email").validate(function (value) {
  const EMAIL_RE = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return EMAIL_RE.test(value);
}, "The e-mail field must contain a valid e-mail address.");

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `The e-mail ${attr} is already registered.`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
