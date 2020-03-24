const express = require('express');

const api = require("./routes/api.js");

const app = express();

app.use('/api', api);
app.use(express.static("public"));

app.listen(3000);