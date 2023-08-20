const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { getToken } = require("../utils/index");

const register = async (req, res) => {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done({ message: "Incorrect email or password" });
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    return done(err, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);

    if (!user)
      return res.json({ error: 1, message: "Incorrect email or password" });

    let signed = jwt.sign(user, config.secretkey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
    return res.json({
      message: "Login successful",
      user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user)
      return res.json({
        err: 1,
        message: "User not found",
      });
    let token = getToken(req);
    if (!token)
      return res.json({
        err: 1,
        message: "Token not found",
      });
    await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );
    return res.json({
      message: "Logout successful",
    });
  } catch (err) {
    return next(err);
  }
};

const me = (req, res, next) => {
  if (!req.user) {
    res.json({
      err: 1,
      message: `You're not login or token expired`,
    });
  }

  res.json(req.user);
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
