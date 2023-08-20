const { getToken, policyFor } = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);
      if (!token) return next();

      req.user = jwt.verify(token, config.secretkey);
      let user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        res.json({ error: 1, message: "Invalid token" });
      }
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        return res.json({ error: 1, message: err.message });
      }
      next(err);
    }

    return next();
  };
}

function policies_check(action, subject) {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
    }
    next();
  };
}

module.exports = {
  decodeToken,
  policies_check,
};
