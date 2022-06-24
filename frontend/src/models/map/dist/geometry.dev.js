"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concentricCircles = concentricCircles;
exports.concentricCircle = concentricCircle;

var L = require('leaflet');

function createRadials(latlng, _ref) {
  var _ref$data = _ref.data,
      data = _ref$data === void 0 ? null : _ref$data,
      _ref$groupData = _ref.groupData,
      groupData = _ref$groupData === void 0 ? null : _ref$groupData,
      _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 100 : _ref$radius,
      _ref$startAngle = _ref.startAngle,
      startAngle = _ref$startAngle === void 0 ? 0 : _ref$startAngle,
      _ref$stopAngle = _ref.stopAngle,
      stopAngle = _ref$stopAngle === void 0 ? 360 : _ref$stopAngle,
      _ref$innerRadius = _ref.innerRadius,
      innerRadius = _ref$innerRadius === void 0 ? 0 : _ref$innerRadius,
      _ref$openPopup = _ref.openPopup,
      openPopup = _ref$openPopup === void 0 ? null : _ref$openPopup;
  var circles = [];
  var donutWidth = (radius - innerRadius) / data.length;

  for (var j = data.length - 1; j >= 0; j--) {
    var subRadius = innerRadius + donutWidth * (j + 1);
    var innerSubRadius = innerRadius + donutWidth * j;
    var sliceOptions = Object.assign({}, {
      radius: subRadius,
      innerRadius: innerSubRadius,
      data: data,
      startAngle: startAngle,
      stopAngle: stopAngle,
      openPopup: openPopup,
      groupData: groupData
    }, {
      data: data[j]
    });
    var children = concentricCircle(latlng, sliceOptions);
    circles.push(children);
  }

  return L.featureGroup(circles);
}

function concentricCircles(latlng, data) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$radius = _ref2.radius,
      radius = _ref2$radius === void 0 ? 100 : _ref2$radius,
      _ref2$innerRadius = _ref2.innerRadius,
      innerRadius = _ref2$innerRadius === void 0 ? 0 : _ref2$innerRadius,
      _ref2$startAngle = _ref2.startAngle,
      startAngle = _ref2$startAngle === void 0 ? 0 : _ref2$startAngle,
      _ref2$openPopup = _ref2.openPopup,
      openPopup = _ref2$openPopup === void 0 ? null : _ref2$openPopup,
      _ref2$borderStyle = _ref2.borderStyle,
      borderStyle = _ref2$borderStyle === void 0 ? {} : _ref2$borderStyle;

  var concentricCircles = [];
  data.forEach(function (slice, i) {
    var angleWidth = 360 / data.length;
    var subStartAngle = startAngle + angleWidth * i;
    var stopAngle = subStartAngle + angleWidth;

    if (slice.data.length == 0) {
      var graphics = L.semiCircleMarker(latlng, Object.assign({}, {
        radius: radius,
        startAngle: subStartAngle,
        stopAngle: stopAngle,
        fillColor: "#ddd",
        weight: 1,
        color: "#fff",
        stroke: "true"
      }));
      concentricCircles.push(graphics);
      assignGeometryProperties(graphics, {
        data: null,
        groupData: slice.groupData,
        openPopup: openPopup
      });
    } else {
      var circle = createRadials(latlng, {
        data: slice.data,
        groupData: slice.groupData,
        radius: radius,
        startAngle: subStartAngle,
        stopAngle: stopAngle,
        innerRadius: innerRadius,
        openPopup: openPopup
      });
      concentricCircles.push(circle);
    }
  });
  data.forEach(function (slice, i) {
    var angleWidth = 360 / data.length;
    var subStartAngle = startAngle + angleWidth * i;
    var stopAngle = subStartAngle + angleWidth;
    var graphics = L.semiCircleMarker(latlng, Object.assign({}, {
      radius: radius,
      startAngle: subStartAngle,
      stopAngle: stopAngle,
      fillColor: "#ddd",
      weight: 1,
      color: "#fff",
      stroke: "true"
    }, borderStyle));
    concentricCircles.push(graphics);
  });
  return L.featureGroup(concentricCircles);
}

function concentricCircle(latlng) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$data = _ref3.data,
      data = _ref3$data === void 0 ? [] : _ref3$data,
      _ref3$groupData = _ref3.groupData,
      groupData = _ref3$groupData === void 0 ? null : _ref3$groupData,
      _ref3$radius = _ref3.radius,
      radius = _ref3$radius === void 0 ? 100 : _ref3$radius,
      _ref3$startAngle = _ref3.startAngle,
      startAngle = _ref3$startAngle === void 0 ? 0 : _ref3$startAngle,
      _ref3$stopAngle = _ref3.stopAngle,
      stopAngle = _ref3$stopAngle === void 0 ? 360 : _ref3$stopAngle,
      _ref3$innerRadius = _ref3.innerRadius,
      innerRadius = _ref3$innerRadius === void 0 ? 0 : _ref3$innerRadius,
      _ref3$openPopup = _ref3.openPopup,
      openPopup = _ref3$openPopup === void 0 ? null : _ref3$openPopup;

  var circles = [];
  if (groupData == null) groupData = data;
  if (!Array.isArray(data)) data = [data];

  for (var i = data.length - 1; i >= 0; i--) {
    var item = data[i];
    var angleWidth = (stopAngle - startAngle) / data.length;

    var _startAngle = startAngle + angleWidth * i;

    var _stopAngle = startAngle + angleWidth * (i + 1);

    if (Array.isArray(item)) {
      var radials = createRadials(latlng, {
        radius: radius,
        innerRadius: innerRadius,
        startAngle: _startAngle,
        stopAngle: _stopAngle,
        data: item,
        openPopup: openPopup,
        groupData: groupData
      });
      circles.push(radials);
    } else {
      var graphics = L.semiCircleMarker(latlng, Object.assign({}, {
        radius: radius,
        startAngle: _startAngle,
        stopAngle: _stopAngle
      }, item));
      assignGeometryProperties(graphics, {
        data: item,
        groupData: groupData,
        openPopup: openPopup
      });
      circles.push(graphics);
    }
  }

  return L.featureGroup(circles);
}

function assignGeometryProperties(geom, _ref4) {
  var data = _ref4.data,
      groupData = _ref4.groupData,
      openPopup = _ref4.openPopup;

  if (openPopup) {
    geom.bindPopup(function () {
      return openPopup({
        data: data,
        groupData: groupData
      });
    });
  }
}