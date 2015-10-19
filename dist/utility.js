/**
 * @fileOverview 
 * Utility toolbelt. This is where m.define, m.string, m.instance, etc, are defined.
 */
'use strict';

var Reads = require('./Reads');
var Parser = require('./Parser');
var utils = require('./internal/utils');

var _require = require('./Either');

var Either = _require.Either;
var Left = _require.Left;
var Right = _require.Right;

/**
 * Return a new parser with a definition.
 *
 * @example
 * m.define({
 *   foo: m.define({
 *     bar: m.string
 *   })
 * })
 * 
 * @param  {Object} definition An object of key-value pairs. Each value needs to be a Reads.
 * @return {Parser}
 */
module.exports.define = function (definition) {
  return new Parser(definition);
};

/**
 * Return a reads that performs an instanceof check.
 * @param  {Constructor} T
 * @return {Reads}
 */
module.exports.instance = function (T) {
  return new Reads(function (v) {
    if (v instanceof T) {
      return new Right(v);
    }
    return new Left(new Error('Expected an instance of ' + T + ', but instead got ' + v));
  });
};

/**
 * Define baked-in Reads for JavaScript primitives.
 *
 * M.string
 * M.boolean
 * M.number
 * M.object
 * M.undefined
 * M.null
 * M.array
 */
utils.each(["string", "boolean", "number", "object", "null", "undefined"], function (t) {
  module.exports[t] = new Reads(function (v) {
    if (typeof v === t) {
      return new Right(v);
    }
    return new Left(new Error('Attempted to read value as ' + utils.capitalize(t) + ', but instead got ' + v));
  });
});

module.exports.array = new Reads(function (v) {
  if (Array.isArray(v)) {
    return new Right(v);
  }
  return new Left(new Error('Attempted to read value as Array, but instead got ' + v));
});

/**
 * Read in any value.
 *
 * @example
 * m.define({ foo: m.any }).parse("blah")
 * Right({ foo: "blah" })
 * 
 * @type {Reads}
 */
module.exports.any = new Reads(Either.unit);