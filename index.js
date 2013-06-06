// node-planefinder
//
// John Wiseman <jjwiseman@gmail.com> @lemonodor
//
// Example of requesting plane data from planefinder.net.

var events = require('events');
var http = require('http');
var util = require('util');


exports.createClient = function(options) {
  return new Client(options);
}

var Client = function(options) {
  events.EventEmitter.call(this);
  var options = options || {};
  this.faa = options.faa !== undefined ? options.faa : true;
  this.bounds = options.bounds;
  this.interval = options.interval || 20000;
};

Client.prototype.resume = function() {
  this.startRequest();
  setInterval(this.startRequest.bind(this), this.interval);
};

Client.prototype.url = function() {
  var url = ('http://planefinder.net/endpoints/update.php?' +
             'faa=' + (this.faa ? '1' : '0') +
             '&bounds=' + encodeURIComponent(this.bounds.join(',')));
  return url;
};

Client.prototype.startRequest = function() {
  var req = http.get(this.url(), this._handleResponse.bind(this));
  req.on('error', this._emitError.bind(this));
};

Client.prototype._handleResponse = function(res) {
  res.on('data', this._handleResponseData.bind(this));
  res.on('end', this._handleResponseEnd.bind(this));
  res.on('error', this._emitError.bind(this));
};

Client.prototype._handleResponseData = function(chunk) {
  this.body += chunk;
};

Client.prototype._handleResponseEnd = function() {
  var traffic = parseJson(this.body);
  this.emit('data', traffic);
};

Client.prototype._emitError = function(err) {
  this.emit('error', err);
};


exports.parseJson = function(reportsJson) {
  planes = JSON.parse(reportsJson).planes;
  traffic = [];
  for (var i = 0; i < planes.length; i++) {
    var planeMap = planes[i];
    for (var hex_ident in planeMap) {
      var plane = planeMap[hex_ident];
      var aircraft = {
        hex_ident: hex_ident,
        callsign: plane[10],
        lat: plane[3],
        lon: plane[4],
        altitude: plane[5],
        track: plane[6],
        ground_speed: plane[7]
      };
      traffic.push(aircraft);
    }
  }
  return traffic
};
