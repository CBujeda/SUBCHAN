const express = require('express');


const app  = express();
const port = 3020;
const host = "localhost";

const bodyParser = require("body-parser");

// Configure bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

//Configure post
/*
app.use(bodyParser.urlencoded({
    extended:true
}));
*/
//
//var nanoid = require('nanoid');

const routes = require('./routes')(app,bodyParser);


//Inicializando server
app.listen(port,() =>
    console.log(`Server oppened in port = ${port}`)
)