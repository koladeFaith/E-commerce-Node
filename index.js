const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
dotenv.config();
const app = express();
const saltRounds = 10
app.use(express.json())
const userRouters = require("./routes/user.route")
app.use("user", userRouters)
const User = mongoose.model("User", new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
}))

// Middleware
app.use(cors());
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})
app.post('/api/signup', async (request, response) => {

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

    const transporter = nodemailer.createTestAccount({
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
            response.status(400).json("Email error:", err)
        }
        else {
            console.log("Email sent:", info.response);
            response.status(200).json("Email sent:", info.response)
        }
    })
    response.status(200).json({
        message: "User registered successfully",
        status: "success",
        data: {
            user: { firstName, lastName, email },

        }
    });
})
app.post('/signup', (req, res) => {
    console.log('Signup route hit!');
    console.log(req.body);
});
// Public route

// app.post('/sendEmail', (req, res) => {
//     const { email } = res.body
//     if (!email) {
//         return res.status(400).send("Email is required")
//     }
//     const transporter = nodemailer.createTestAccount({
//         service: 'gmail',
//         auth: {
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASSWORD

//         }
//     })
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "Test Email",
//         text: "Welcome",
//         html: "<p>Welcome</p>"
//     }
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return response.status(400)
//         }
//     })
// });
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 6300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));