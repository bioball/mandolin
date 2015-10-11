const { Either, Left, Right } = require('./Either');
const utils = require('./utils');
const Reads = require('./Reads');

/**
 * Responsible for taking an object of key -> Read pairs, and parsing an object out.
 *
 * A Parser is just a Reads, that has special rules around how it handles `getValue`. Parsers can be nested.
 * 
 * @example
 * const definition = {
 *   "firstName": M.string,
 *   "lastName": M.string,
 *   "email": Option.as(M.string),
 *   "address": new Parser({
 *     "street1": M.string
 *   })
 * }
 *
 * new Parser(definition).parse({
 *  "firstName": "Bob",
 *  "lastName": "Cassidy",
 *  "email": null,
 *  "address": {
 *    "street1": "123 Fake St"
 *  }
 * }).map((obj) => console.log(obj))
 * // => { "firstName": "Bob", "lastName": "Cassidy", "email": None() }
 */

class Parser extends Reads {

  constructor (definition = {}, name = "obj") {
    super();
    this.definition = definition;
  }

  getValue (target) {
    return this.parse(target);
  }

  /**
   * @param  {Object} target [description]
   * @return {Either}        [description]
   */
  parse (target = {}) {
    return Object.keys(this.definition).reduce((result, key) => {
      if (result.isLeft()) {
        return result;
      }
      const read = this.definition[key];
      const value = target[key];
      return result.flatMap((obj) => {
        return read.getValue(value).map((v) => utils.extend(obj, { [key]: v }));
      });
    }, new Right({}));
  }
}

Parser.define = function(definition){
  return new Parser(definition);
};

module.exports = Parser;