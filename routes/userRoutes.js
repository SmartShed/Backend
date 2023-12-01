const express = require("express");
const router = express.Router();




const {
  register,
  login,
  logout,
  googleLogin,
  googleRegister,
  addEmployee,
  me,
  forgotPassword,
  validateOTP,
  resetPassword,
} = require("../controllers/userController");

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.post("/login/google", googleLogin);

router.post("/register/google", googleRegister);

router.post("/addemployee", addEmployee);

router.get("/me", me);

router.post('/forgot-password', forgotPassword);

router.post('/validate-otp', validateOTP);

router.post('/reset-password', resetPassword);



module.exports = router;
