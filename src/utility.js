const Reads = require('./Reads');
const Parser = require('./Parser');
const utils = require('./internal/utils');
const { Either, Left, Right } = require('./Either');

/**
 * Utility toolbelt. This is where M.define, M.string, M.instance, etc, are defined.
 */

module.exports.define = function(definition){
  return new Parser(definition);
};

module.exports.instance = function (T) {
  return new Reads(function (v) {
    if (v instanceof T) {
      return new Right(v);
    }
    return new Left(new Error(`Expected an instance of ${ T }, but instead got ${ v }`));
  });
};

/**
 * Define baked-in Reads for JavaScript primitives.
 *
 * Reads.string
 * Reads.boolean
 * Reads.number
 * Reads.object
 * Reads.undefined
 * Reads.null
 */
utils.each([
  "string",
  "boolean",
  "number",
  "object",
  "null",
  "undefined"
], (t) => {
  module.exports[t] = new Reads(function (v) {
    if (typeof v === t) {
      return new Right(v);
    }
    return new Left(new Error(`Attempted to read value as ${ utils.capitalize(t) }, but instead got ${ v }`));
  });
});

module.exports.array = new Reads(function (v) {
  if (Array.isArray(v)) {
    return new Right(v);
  }
  return new Left(new Error(`Attempted to read value as Array, but instead got ${ v }`));
});