const http=require('http');
const Sequelize=require('sequelize');
const sequelize = require('./db');
const Model = Sequelize.Model;
const http_handler=require('./Handlers/httpHandler');
var url = require("url");
var fs = require("fs");

const server=http.createServer(function (req, res) {
    try {
        http_handler (req, res);
    }
    catch (err) {
        console.error(err);
    }
}).listen(3000);

sequelize.authenticate()        
.then(() => console.log('Connection is successful!'))
.catch((err) => console.log('Error in database connection', err));