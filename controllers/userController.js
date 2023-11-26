const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuthToken = require("../models/AuthToken");
const EmployeeEmail = require("../models/EmployeeEmail");
const Joi = require("joi");

const { JWT_SECRET } = require("../config");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
  name: Joi.string().required(),
  position: Joi.string().valid("authority", "supervisor", "worker").required(),
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
    const user = await User.findOne({ email });

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
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    validateRequest(req, registerSchema);

    const { email, password, name, position } = req.body;

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

    res.status(201).json({
      auth_token: token,
      message: "Registration successful",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  console.log(req.headers);

  try {
    validateRequest(req.headers, logoutSchema);

    const { auth_token } = req.headers;

    const authToken = await AuthToken.findOne({ token: auth_token });

    const deleteToken = await AuthToken.deleteOne(authToken);

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
    const user = await User.findOne({ email });
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
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const googleRegister = async (req, res) => {
  try {
    validateRequest(req, googleRegisterSchema);

    const { email, name, position } = req.body;

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

    res.status(201).json({
      auth_token: token,
      message: "Registration successful",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeDuplicates = (arr) => [...new Set(arr)];

const addEmployee = async (req, res) => {
  const { worker, supervisor, authority } = req.body;

  try {
    let existingInstance = await EmployeeEmail.findOne();

    if (!existingInstance) {
      existingInstance = new EmployeeEmail({ worker, supervisor, authority });
    } else {
      existingInstance.worker = removeDuplicates([
        ...existingInstance.worker,
        ...worker,
      ]);
      existingInstance.supervisor = removeDuplicates([
        ...existingInstance.supervisor,
        ...supervisor,
      ]);
      existingInstance.authority = removeDuplicates([
        ...existingInstance.authority,
        ...authority,
      ]);
    }

    await existingInstance.save();

    res.status(200).json({ message: "Employee emails added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  logout,
  googleLogin,
  googleRegister,
  addEmployee,
};
