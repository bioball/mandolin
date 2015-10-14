'use strict';

var _require = require('./Option');

var Option = _require.Option;
var Some = _require.Some;
var None = _require.None;

var _require2 = require('./Either');

var Either = _require2.Either;
var Left = _require2.Left;
var Right = _require2.Right;

var Parser = require('./Parser');
var Reads = require('./Reads');
var utils = require('./internal/utils');
var utility = require('./utility');

module.exports = utils.extend(utility, { Option: Option, Some: Some, None: None, Either: Either, Left: Left, Right: Right, Parser: Parser, Reads: Reads });