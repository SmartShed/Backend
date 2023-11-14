const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Incorrect password"
        });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        token,
        message: "Login successful"
    });
};


const register = async (req, res) => {

    const { email, password, name, position } = req.body;

    if (!email || !password || !name || !position) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const user = User.findOne({ email });

    if (user) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        position
    });

    await newUser.save();

    res.status(201).json({
        message: "User created"
    });
}




module.exports = {
    login, register
};