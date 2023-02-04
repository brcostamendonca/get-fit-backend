var express = require('express');
var app = express();
var fs = require("fs");
var generateApi = require('./api/generate');

app.use(express.json())


app.post('/generatePetName', function (req, res) {
    generateApi.generatePetName(req,res);
})



var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})