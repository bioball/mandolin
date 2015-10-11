const { Either, Left, Right } = require('./Either');
const utils = require('./internal/utils');
const Reads = require('./Reads');

/**
 * Responsible for taking an object of key -> Read pairs, and parsing an object out.
 *
 * A Parser is just a Reads, that has special rules around how it handles `getValue`. Parsers can be nested.
 * A Parser keeps track of its path, so the route to an unsuccessful parse is displayed to the user.
 * 
 * Parsers shouldn't need to be expoesd to the user. Instead, users should use `M.define` to instantiate a Parser.
 * 
 * @example
 * const definition = M.define({
 *   "firstName": M.string,
 *   "lastName": M.string,
 *   "email": Option.as(M.string),
 *   "address": M.define({
 *     "street1": M.string
 *   })
 * });
 *
 * definition.parse({
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

  constructor (definition = {}, path = ["obj"]) {
    super();
    this.definition = definition;
    this.path = path;
  }

  /**
   * @override
   */
  getValue (target) {
    return this.parse(target);
  }

  /**
   * This is for error debugging when a parse fails.
   */
  setPath (name) {
    return new Parser(this.definition, this.path.concat([name]));
  }

  /**
   * @private
   */
  getRead (read, key) {
    return read instanceof Parser ? read.setPath(key) : read;
  }

  /**
   * @private
   */
  applyErrorPath (key) {
    return (err) => {
      const route = this.path.concat([key]).join(".");
      return new Error(`${ route }: ${ err.message }`);
    };
  }

  /**
   * @param  {Object} target  The object that needs to be parsed
   * @return {Either<Error, A>}
   */
  parse (target = {}) {
    return utils.reduce(Object.keys(this.definition), (result, key) => {
      if (result.isLeft()) {
        return result;
      }
      const read = this.definition[key];
      const value = target[key];
      return result.flatMap((obj) => {
        return this
          .getRead(read, key)
          .getValue(value)
          .map((v) => utils.extend(obj, { [key]: v }));
          // .mapLeft(this.applyErrorPath(key));
      });
    }, new Right({}));
  }
};

module.exports = Parser;