// node-planefinder
//
// John Wiseman <jjwiseman@gmail.com> @lemonodor
//
// Example of requesting plane data from planefinder.net.

var events = require('events');
var http = require('http');
var url = require('url');
var util = require('util');

var planefinder = exports;

exports.createClient = function(options) {
  var client = new planefinder.Client(options);
  return client;
};

// Options:
//   bounds (required): Array of points defining bounding box of
//     interest.
//   faa: Show FAA-reported flights?
//   interval: Refresh interval (in milliseconds).
exports.Client = function(options) {
  events.EventEmitter.call(this);
  options = options || {};
  this.faa = options.faa !== undefined ? options.faa : true;
  this.bounds = options.bounds;
  if (!this.bounds) {
    throw new Error('Must specify bounds in options.');
  }
  this.interval = options.interval || 20000;
};
util.inherits(exports.Client, events.EventEmitter);

exports.Client.prototype.resume = function() {
  this.startRequest();
  setInterval(this.startRequest.bind(this), this.interval);
};

exports.Client.prototype.url = function() {
  var bounds = [this.bounds[0].latitude,
                this.bounds[0].longitude,
                this.bounds[1].latitude,
                this.bounds[1].longitude];
  var url = ('http://planefinder.net/endpoints/update.php?' +
             'faa=' + (this.faa ? '1' : '0') +
             '&bounds=' + encodeURIComponent(bounds.join(',')));
  return url;
};

exports.Client.prototype.startRequest = function() {
  this.body = '';
  var options = url.parse(this.url());
  options.headers = {
    'X-Requested-With': 'XMLHttpRequest'
  };
  var req = http.get(options, this._handleResponse.bind(this));
  req.on('error', this._emitError.bind(this));
};

exports.Client.prototype._handleResponse = function(res) {
  res.on('data', this._handleResponseData.bind(this));
  res.on('end', this._handleResponseEnd.bind(this));
  res.on('error', this._emitError.bind(this));
};

exports.Client.prototype._handleResponseData = function(chunk) {
  this.body += chunk;
};

exports.Client.prototype._handleResponseEnd = function() {
  var traffic = planefinder.parseJson(this.body);
  this.emit('data', traffic);
};

exports.Client.prototype._emitError = function(err) {
  this.emit('error', err);
};


exports.parseJson = function(reportsJson) {
  var planes = [];
  try {
    planes = JSON.parse(reportsJson).planes;
  }
  catch (e) {}  
  var traffic = [];
  for (var i = 0; i < planes.length; i++) {
    var planeMap = planes[i];
    for (var hex_ident in planeMap) {
      var plane = planeMap[hex_ident];
      var aircraft = {
        hex_ident: hex_ident,
        callsign: plane[10], // flight number when active
        journey: plane[11] || plane[10], // journey is set in callsign when flight is inactive
        aircraft: plane[0],
        lat: plane[3],
        lon: plane[4],
        altitude: plane[5],
        track: plane[6],
        ground_speed: plane[7]
      };
      traffic.push(aircraft);
    }
  }
  return traffic;
};
