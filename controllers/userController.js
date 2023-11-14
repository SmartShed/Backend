const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuthToken = require("../models/AuthToken");

const { JWT_SECRET } = require("../config");



const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
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
            JWT_SECRET,
            { expiresIn: "1week" }
        );

        const authToken = new AuthToken({
            token,
            user: user._id
        });

        await authToken.save();


        res.status(200).json({
            token,
            message: "Login successful"
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};



const register = async (req, res) => {

    const { email, password, name, position } = req.body;

    if (!email || !password || !name || !position) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const user = await User.findOne({ email });


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

        // Create a new JWT for the user
        const token = jwt.sign(
            { id: newUser._id },
            JWT_SECRET,
            { expiresIn: "1week" }
        );


        // Create a new auth token for the user and save it to the database
        const authToken = new AuthToken({
            token,
            user: newUser._id
        });

        await authToken.save();

        res.status(201).json({
            auth_token: token,
            message: "Registration successful"
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const logout = async (req, res) => {
    const { auth_token } = req.headers;


    if (!auth_token) {
        return res.status(400).json({
            message: "Token is required"
        });
    }

    try {


        const authToken = await AuthToken.findOne({ token: auth_token });

        const deleteToken = await AuthToken.deleteOne(authToken);



        res.status(200).json({
            message: "Logout successful"
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}




module.exports = {
    login, register, logout
};