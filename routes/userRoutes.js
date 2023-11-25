const express = require('express');
const router = express.Router();

const { register, login, logout, googleLogin, googleRegister, addEmployee } = require('../controllers/userController');


router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);


router.post("/login/google", googleLogin);

router.post("/register/google", googleRegister);

router.post("/addemployee", addEmployee);

module.exports = router;

