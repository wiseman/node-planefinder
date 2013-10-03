node-planefinder
================

This is a node.js module that can get aircraft location information
from planefinder.net.

[![build status](https://secure.travis-ci.org/wiseman/node-planefinder.png)](http://travis-ci.org/wiseman/node-planefinder)

See the example in `bin/demo.js`.

```
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
