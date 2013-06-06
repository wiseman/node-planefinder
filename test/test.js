var assert = require('assert');

var test = require('tap').test;

var planefinder = require('../index');


var json = '{"planes":[{"A8BC29":["A306","N662FE","FDX980",34.1994,-118.521,0,0,0,"1370476578","FDX","","LAX-LAS"]}, {"A3A870":["BE9L","N335AP","N335AP",34.21,-118.49,0,0,0,"1370476380","","?-VNY"]}],"paths":[],"isPartial":true}';

test('Parsing JSON', function(t) {
  var traffic = planefinder.parseJson(json);
  t.equal(traffic.length, 2);
  var p1 = traffic[0];
  t.equal(p1.hex_ident, 'A8BC29');
  t.equal(p1.callsign, '');
  t.equal(p1.lat, 34.1994);
  t.equal(p1.lon, -118.521);
  t.equal(p1.altitude, 0);
  t.equal(p1.track, 0);
  t.equal(p1.ground_speed, 0);
  var p2 = traffic[1];
  t.equal(p2.hex_ident, 'A3A870');
  t.equal(p2.callsign, '?-VNY');
  t.equal(p2.lat, 34.21);
  t.equal(p2.lon, -118.49);
  t.equal(p2.altitude, 0);
  t.equal(p2.track, 0);
  t.equal(p2.ground_speed, 0);
  t.end();
});
