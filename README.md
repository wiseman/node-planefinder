node-planefinder
================

This is a node.js module that can get aircraft location information
from planefinder.net.

**This library no longer works--planefinder have begun obfuscating their unofficial API data.  See [issue #4](https://github.com/wiseman/node-planefinder/issues/4).**

[![build status](https://secure.travis-ci.org/wiseman/node-planefinder.png)](http://travis-ci.org/wiseman/node-planefinder)

Here's an example of how to use the library to track aircraft (this
code is available in `bin/demo.js`):

```javascript
planefinder = require('planefinder');
geolib = require('geolib');

// Let's observe planes within 10 km of LAX airport.

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
```

And here's what the output looks like:

```bash
$ npm install
$ node bin/demo.js
[ { hex_ident: '3C4A88',
    callsign: 'LH451',
    lat: 33.8845,
    lon: -118.516,
    altitude: 2325,
    track: 203,
    ground_speed: 246 },
  { hex_ident: 'A33D8C',
    callsign: '',
    lat: 33.9333,
    lon: -118.386,
    altitude: 0,
    track: 270,
    ground_speed: 0 },
  { hex_ident: 'A6A728',
    callsign: '',
    lat: 33.9337,
    lon: -118.389,
    altitude: 0,
    track: 174,
    ground_speed: 2 },
  ...
```
