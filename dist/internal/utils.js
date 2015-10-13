"use strict";

var each = function each(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i], i);
  }
};

var map = function map(arr, fn) {
  var result = [];
  each(arr, function (element, i) {
    return result[i] = fn(element, i);
  });
  return result;
};

var reduce = function reduce(arr, fn, seed) {
  var result = seed;
  each(arr, function (element, i) {
    return result = fn(result, element, i);
  });
  return result;
};

var abstractClassCheck = function abstractClassCheck(currentThis, target, name) {
  if (currentThis.constructor === target) {
    throw new Error("Cannot instantiate abstract class " + name);
  }
};

var extend = function extend(obj1) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  var extendOnce = function extendOnce(a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a;
  };
  return reduce(rest, extendOnce, obj1);
};

var capitalize = function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
};

module.exports = { each: each, reduce: reduce, abstractClassCheck: abstractClassCheck, extend: extend, capitalize: capitalize };