const express = require('express');
const app = express();


// Import routes
const userRoute = require('./routes/User');
const postRoute = require('./routes/Post');


//Router MIddlewares
app.use(express.json());
app.use(userRoute)
app.use(postRoute)

module.exports = app;
