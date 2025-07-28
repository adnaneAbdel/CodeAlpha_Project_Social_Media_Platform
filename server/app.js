const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 3000;
const BodyParser = require('body-parser');
const morgan = require('morgan');

const generalRoutes = require('./router/generalRoutes');
const authRoutes = require('./router/authRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));
// Middleware for JSON parsing and URL encoding
app.use(express.json());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use('/api', generalRoutes);

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI);
app.listen(port, () => {
    console.log(`the server run ... ${process.env.PORT}`)
})
