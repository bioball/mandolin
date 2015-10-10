const utils = require('./utils');
const Reads = require('./Reads');
const { Left, Right } = require('./Either');

/**
 * @class Option
 * @abstract
 * A monadic type for values that might not exist. Using option types will guarantee that you will not have null exception.
 * 
 * This library is heavily inpsired by Scala's native Option type.
 */
class Option {

  constructor (val = null) {
    utils.abstractClassCheck(this, Option, "Option");
    this.val = val;
  }

  isSome () {
    return this instanceof Some;
  }

  isNone () {
    return this instanceof None;
  }

  unit () {
    return new Option(this.val);
  }

  /**
   * @private
   */
  get () {
    if (this.isSome()) {
      return this.val;
    }
    throw new Error("Performed a get on a None type")
  }

  /**
   * Return a new option type based on running f.
   *
   * @example
   * Some("Barry")
   * .map((n) => n + " Bonds")
   * // => Some("Barry Bonds")
   * 
   * @param  {(A) => A} f 
   * @return {Option[A]}
   */
  map (f) {
    if (this.isSome()) {
      return new Some(f(this.val));
    }
    return this;
  }

  /**
   * Return a new option type given a function that returns an Option type.
   *
   * @example
   * Some(5).flatMap((val) => new Option(val + 4))
   * // => Some(9)
   * 
   * @param  {(A) => new Option(A)} f
   * @return {A}
   */
  flatMap (f) {
    if (this.isSome()) {
      return f(this.val);
    }
    return this;
  }

  /**
   * If this is a some, returns the value. Otherwise, returns the return value of `f`.
   *
   * @example
   * None().map((val) => val + "foo")
   * .getOrElse("Bayview Hunter's Point")
   * // => "Bayview Hunter's Point"
   * 
   * @param  {[type]} f [description]
   * @return {[type]}   [description]
   */
  getOrElse (f) {
    if (this.isSome()) {
      return this.get();
    }
    return f();
  }

  /**
   * Helper for operations on options. Calling `match` is the same thing as chaining `map` and `getOrElse`.
   * 
   * @example
   * new Some(3).match({
   *   Some (a) {
   *     return a + 5;
   *   },
   *   None () {
   *     return 0;
   *   }
   * });
   * // => 8
   * 
   * @param  {(A) => A} options.some    
   * @param  {() => A} options.none
   * @return {A} The value itself.
   */
  match ({ Some, None }) {
    return this.map(Some).getOrElse(None);
  }

}

/**
 * Generic Reads for the option type.
 * @return {Right<Option>}
 */
Option.reads = new Reads(function(val){
  const opt = (val === null || val === undefined) ? new None() : new Some(val);
  return new Right(opt);
});

/**
 * Composes a Read for an arbitrary type with a Read for an Option type.
 *
 * @example
 * // Generic Read for Option of a String
 * Option.as(M.string)("foo") // => Some("foo")
 * Option.as(M.string)() // => None()
 *
 * // Read to perform an intanceof check
 * Option.as(M.instance(User))(new User()) // => Some(User())
 *
 * // Reads for only odd integers
 * Option.as(new Reads((val) => val % 2 ? new Right(val) : new Left(val)))
 * 
 * @param  {Read} read A Reads for this type of value.
 * @return {Read}
 */
Option.as = function(read){
  return Option.reads.map((opt) => opt.flatMap(read.getValue));
};

class Some extends Option {
  constructor (val) {
    super(val);
  }

  toJSON () {
    return this.value;
  }

  toString () {
    return `Some(${ this.value })`
  }
}

class None extends Option {
  constructor () {
    super();
  }

  toJSON () {
    return null;
  }

  toString () {
    return "None()";
  }
}

module.exports = { Option, Some, None };