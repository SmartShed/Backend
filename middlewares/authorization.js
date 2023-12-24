const AuthToken = require("../models/AuthToken");

const authorization = (role) => async (req, res, next) => {
  try {
    const auth_token = req.headers.auth_token;

    if (!auth_token) {
      throw new Error("Auth token not found");
    }

    let user = await AuthToken.findOne({ token: auth_token }).populate("user");

    if (!user) {
      throw new Error("Invalid auth token");
    }

    user = user.user;

    const position = user.position;

    if (position !== role) {
      throw new Error("Unauthorized");
    }

    next();
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

module.exports = authorization;
