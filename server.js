var express = require('express');
var app = express();
var fs = require("fs");
var generatePetNameApi = require('./api/generatePetName');
var generateWorkoutApi = require('./api/generateWorkout');

app.use(express.json())


app.post('/generatePetName', function (req, res) {
    generatePetNameApi.generatePetName(req,res);
})

app.post('/generateWorkout', function (req, res) {
    generateWorkoutApi.generateWorkout(req,res);
})



var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})