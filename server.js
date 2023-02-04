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



// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8081;        // set our port
app.listen(port);
console.log('Magic happens on port ' + port);