const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const saltRounds = 10
const nodemailer = require("nodemailer")
// import jwt = "jsonwebtoken"

exports.signup = async (request, response) => {

    const { firstName, lastName, email, password } = request.body
    const existinguser = await User.findOne({ email })

    if (existinguser) {
        response.status(400).json({ message: "User already exists" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = new User({ firstName, lastName, email, password: hashedPassword })
    await user.save()

    if (!email) {
        return response.status(400).send("Email is required")
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD

        }
    })
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Test Email",
        text: "Welcome",
        html: "<p>Welcome</p>"
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email error:", err);
            response.status(400).json("Email error:", error)
        }
        else {
            console.log("Email sent:", info.response);
            response.status(200).json("Email sent:", info.response)
        }
    })
    response.status(200).json({
        message: "Account registered successfully",
        status: "success",
        data: {
            user: { firstName, lastName, email },

        }
    });
}
exports.signin = async (request, response) => {
    const { email, password } = request.body
    const user = await User.findOne({ email })
    if (!user) {
        response.status(400).json({ message: "User not found" })
        return
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) return response.status(401).json({ message: "Incorrect password" })
    // jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: "5m" }, (err, token) => {
    // console.log(token);
    // response.status(201).json({ token: token })
    // })
    response.status(200).json({
        message: "Login successful", user,
        status: "success"
    })
}