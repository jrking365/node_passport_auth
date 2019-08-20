const express = require('express');
const indexRoute = require('./routes/index')
const app = express();

//Routes
app.use('/', indexRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));