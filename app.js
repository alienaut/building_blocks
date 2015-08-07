var express = require("express");
var logger = require('./logger');
var blocks = require('./routes/blocks')

var app = express();

app.use(logger);
app.use(express.static('public'));
app.use('/blocks', blocks);

app.listen(3000);
