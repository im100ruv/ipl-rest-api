const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const matchRoute = require('./routes/teams');
const playerRoute = require('./routes/players');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/iplstats');

mongoose.connection.once('open', function(){
  console.log('connected to mongodb...');
}).on('error', function(error){
  console.log("connection error: ",error);
});

let server = express();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use('/api/teams', matchRoute);
server.use('/api/players', playerRoute);

server.listen(8082, function(){
  console.log("server is listening at: http://localhost:8082 ")
});
