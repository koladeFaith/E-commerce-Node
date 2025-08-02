const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json())
const userRouters = require("./routes/user.route")


// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // your React app port
    credentials: true
}));
app.use("/user", userRouters)
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));