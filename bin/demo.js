planefinder = require('../index');
geolib = require('geolib');

var laxCoords = {
  latitude: 33.9471,
  longitude: -118.4082
};
var maxDistance = 10000;  // meters

var bounds = geolib.getBoundsOfDistance(laxCoords, maxDistance);

var client = planefinder.createClient({
  bounds: bounds
});
client.on('data', function(traffic) {
  console.log(traffic);
});
client.resume();
