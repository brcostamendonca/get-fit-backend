var express = require('express');
const cors = require('cors');

var app = express();
var generatePetNameApi = require('./api/generatePetName');
var generateWorkoutApi = require('./api/generateWorkout');

app.use(express.json())
app.use(cors({
  origin: '*'
}));

app.post('/generatePetName', function(req, res) {
  generatePetNameApi.generatePetName(req, res);
})

app.post('/generateWorkout', function(req, res) {
  generateWorkoutApi.generateWorkout(req, res);
})

app.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});




// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8081;        // set our port
app.listen(port);
console.log('Magic happens on port ' + port);