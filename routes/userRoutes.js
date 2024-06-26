const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  googleLogin,
  googleRegister,
  me,
  forgotPassword,
  validateOTP,
  resetPassword,
  getUser,
  isAuthTokenValid,
} = require("../controllers/userController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/login/google", googleLogin);
router.post("/register/google", googleRegister);
router.get("/me", me);
router.post("/forgot-password", forgotPassword);
router.post("/validate-otp", validateOTP);
router.post("/reset-password", resetPassword);
router.get("/getuser/:id", getUser);
router.get("/validate-token", isAuthTokenValid);

module.exports = router;
