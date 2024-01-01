const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AuthToken = require("../models/AuthToken");
const EmployeeEmail = require("../models/EmployeeEmail");
const Otp = require("../models/Otp");
const SectionData = require("../models/SectionData");
const Joi = require("joi");

const { sendMail } = require("../helpers");
const { JWT_SECRET } = require("../config");

const {
  createNotifications,
  createNotification,
} = require("../helpers/notificationHelper");
const { getSupervisorIdsBySection } = require("../helpers/userHelper");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
  name: Joi.string().required(),
  position: Joi.string().valid("authority", "supervisor", "worker").required(),
  section: Joi.string().allow(""),
});

const logoutSchema = Joi.object({
  auth_token: Joi.string().required(),
});

const googleLoginSchema = Joi.object({
  email: Joi.string().email().required(),
});

const googleRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  position: Joi.string().valid("authority", "supervisor", "worker").required(),
  section: Joi.string().allow(""),
});

const validateRequest = (req, schema) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new Error(errorMessage);
  }
};

const login = async (req, res) => {
  try {
    validateRequest(req, loginSchema);

    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const auth_token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1week",
    });

    const authToken = new AuthToken({
      token: auth_token,
      user: user._id,
    });

    await authToken.save();

    res.status(200).json({
      auth_token,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        position: user.position,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    validateRequest(req, registerSchema);

    let { email, password, name, position, section } = req.body;

    if (position !== "authority" && !section) {
      return res.status(400).json({
        message: "Section is required for non-authority positions",
      });
    }

    if (position === "authority") {
      section = "";
    }

    const validEmails = await EmployeeEmail.findOne();

    if (
      !validEmails ||
      !validEmails[position] ||
      !validEmails[position].includes(email)
    ) {
      return res.status(400).json({
        message: "Invalid email for the specified position",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      position,
      section,
    });

    await newUser.save();

    // Create a new JWT for the user
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1week",
    });

    // Create a new auth token for the user and save it to the database
    const authToken = new AuthToken({
      token,
      user: newUser._id,
    });

    await authToken.save();

    const supervisorIds = await getSupervisorIdsBySection(newUser.section);

    await createNotifications(
      supervisorIds,
      "A new worker has been added to your section",
      "आपके अनुभाग में एक नया मजदूर जोड़ा गया है",
      null,
      newUser._id
    );

    res.status(201).json({
      auth_token: token,
      message: "Registration successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        position: newUser.position,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    validateRequest(req.headers, logoutSchema);

    const { auth_token } = req.headers;
    const authToken = await AuthToken.findOne({ token: auth_token });
    await AuthToken.deleteOne(authToken);

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    validateRequest(req, googleLoginSchema);

    const { email } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const auth_token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1week",
    });

    const authToken = new AuthToken({
      token: auth_token,
      user: user._id,
    });
    await authToken.save();
    res.status(200).json({
      auth_token,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        position: user.position,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const googleRegister = async (req, res) => {
  try {
    validateRequest(req, googleRegisterSchema);

    let { email, name, position, section } = req.body;

    if (position !== "authority" && !section) {
      return res.status(400).json({
        message: "Section is required for non-authority positions",
      });
    }

    if (position === "authority") {
      section = "";
    }

    const validEmails = await EmployeeEmail.findOne();

    if (
      !validEmails ||
      !validEmails[position] ||
      !validEmails[position].includes(email)
    ) {
      return res.status(400).json({
        message: "Invalid email for the specified position",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      email,
      name,
      position,
      section,
      password: "google",
      isGoogle: true,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1week",
    });

    const authToken = new AuthToken({
      token,
      user: newUser._id,
    });

    await authToken.save();

    const supervisorIds = await getSupervisorIdsBySection(newUser.section);

    const notifications = await createNotifications(
      supervisorIds,
      "A new worker has been added to your section",
      "आपके अनुभाग में एक नया मजदूर जोड़ा गया है",
      null,
      newUser._id
    );

    res.status(201).json({
      auth_token: token,
      message: "Registration successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        position: newUser.position,
        section: newUser.section,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const me = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;

    if (!auth_token) {
      throw new Error("Auth token not found");
    }

    const user_id = await AuthToken.findOne({ token: auth_token }, { user: 1 });

    if (!user_id) {
      throw new Error("Invalid auth token");
    }

    const user = await User.findOne({ _id: user_id.user });

    if (!user) {
      throw new Error("User not foundd");
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      position: user.position,
      section: user.section,
      forms: user.forms,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await AuthToken.deleteMany({ user: user._id });
    const otp = Math.floor(100000 + Math.random() * 100000);

    const newOtp = new Otp({
      otp,
      email,
    });

    await newOtp.save();

    const emailResponse = await sendMail(user.name, email, otp);

    if (emailResponse === -1) {
      await Otp.deleteOne({ otp });
      return res.status(400).json({ message: "Error sending email" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpInstance = await Otp.findOne({ email, otp });

    if (!otpInstance) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP validated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await AuthToken.deleteMany({ user: user._id });

    await createNotification(
      user._id,
      "Your password has been reset",
      "आपका पासवर्ड रीसेट कर दिया गया है",
      null,
      null
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const users = async (req, res) => {
  try {
    // /users (default)
    // /users?position=authority (authority only)
    // /users?position=authority,supervisor (authority and supervisor only)

    const { position } = req.query;

    const positions = position
      ? position.split(",")
      : ["authority", "supervisor", "worker"];

    const users = await User.find({
      position: { $in: positions },
      isDeleted: false,
    });

    const authorityList = [];
    const supervisorList = [];
    const workerList = [];

    users.forEach((user) => {
      const { _id, name, position } = user;
      if (position === "authority") {
        authorityList.push({ _id, name, email: user.email });
      } else if (position === "supervisor") {
        supervisorList.push({ _id, name, email: user.email });
      } else {
        workerList.push({ _id, name, email: user.email });
      }
    });

    res.status(200).json({
      message: "Users fetched successfully",
      users: {
        authority: authorityList,
        supervisor: supervisorList,
        worker: workerList,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const { users } = req.body;

    const dbUsers = await User.find({ _id: { $in: users } });

    dbUsers.forEach(async (user) => {
      user.isDeleted = true;
      await user.save();
    });

    await AuthToken.deleteMany({ user: { $in: users } });

    res.status(200).json({ message: "Users deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const isAuthTokenValid = async (req, res) => {
  try {
    const { auth_token } = req.headers;

    if (!auth_token) {
      return res.status(400).json({ isAuthTokenValid: false });
    }

    const user_auth = await AuthToken.findOne(
      { token: auth_token },
      { user: 1 }
    ).populate("user");

    if (!user_auth) {
      return res.status(400).json({ isAuthTokenValid: false });
    }

    if (user_auth.user.isDeleted) {
      return res.status(400).json({ isAuthTokenValid: false });
    }

    return res.status(200).json({ isAuthTokenValid: true });
  } catch (err) {
    res.status(400).json({ isAuthTokenValid: false });
  }
};

module.exports = {
  login,
  register,
  logout,
  googleLogin,
  googleRegister,
  me,
  forgotPassword,
  validateOTP,
  resetPassword,
  users,
  deleteUsers,
  getUser,
  isAuthTokenValid,
};
