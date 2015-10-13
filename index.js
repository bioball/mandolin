/**
 * Mandolin
 * @author Daniel Chao
 *
 * Mandolin is a library that provides Monadic data types, as well as an easy way to interop with them.
 */

'use strict';

var _require = require('./dist/Option');

var Option = _require.Option;
var Some = _require.Some;
var None = _require.None;

var _require2 = require('./dist/Either');

var Either = _require2.Either;
var Left = _require2.Left;
var Right = _require2.Right;

var Parser = require('./dist/Parser');
var Reads = require('./dist/Reads');
var utils = require('./dist/internal/utils');
var utility = require('./dist/utility');

module.exports = utils.extend(utility, { Option: Option, Some: Some, None: None, Either: Either, Left: Left, Right: Right, Parser: Parser, Reads: Reads });