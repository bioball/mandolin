/**
 * @fileOverview 
 * Utility toolbelt. This is where M.define, M.string, M.instance, etc, are defined.
 */
const Reads = require('./Reads');
const Parser = require('./Parser');
const utils = require('./internal/utils');
const { Either, Left, Right } = require('./Either');


/**
 * Return a new parser with a definition.
 *
 * @example
 * M.define({
 *   foo: M.define({
 *     bar: M.string
 *   })
 * })
 * 
 * @param  {Object} definition An object of key-value pairs. Each value needs to be a Reads.
 * @return {Parser}
 */
module.exports.define = function(definition){
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
    return new Left(new Error(`Expected an instance of ${ T }, but instead got ${ v }`));
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