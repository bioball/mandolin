const utils = require('./internal/utils');
const Reads = require('./Reads');
const { Left, Right, Either } = require('./Either');

/**
 * @class Option
 * @abstract
 * A monadic type for values that might not exist. Using Options eliminates the need to use a null value.
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
      return this.map(f).flatten();
    }
    return this;
  }

  /**
   * Turns Option(Option<A>) into Option<A>. Will not flatten deeply.
   * @return {Option}
   */
  flatten () {
    if (this.isSome() && this.get() instanceof Option) {
      return this.get();
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

  toJSON () {
    return this.val;
  }

  /**
   * Coerce this to an Either. A Some becomes a Right, a None becomes a Left with no value.
   * @return {Either<null, A>}
   */
  toEither () {
    return this.match({
      Some (val) { return new Right(val) },
      None () { return new Left() }
    });
  }

  /**
   * Cast this to a Promise. A None becomes a Promise rejection, a Some becomes a Promise resolve.
   * @return {Promise}
   */
  toPromise () {
    return this.match({
      None () { return Promise.reject(); },
      Some (val) { return Promise.resolve(val); }
    });
  }

}

/**
 * @alias flatMap
 */
Option.prototype.chain = Option.prototype.flatMap;

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
Option.as = (read) => read.map(Some.unit).mapLeft(None.unit);

Option.unit = Option.of = (val) => new Some(val)


/**
 * @class Some. 
 * Holds a value, but has no opinion on what that value is. The value can even be undefined.
 * 
 * @augments {Option}
 */
class Some extends Option {
  constructor (val) {
    super(val);
  }

  toString () {
    return `Some(${ this.val })`;
  }
}

/**
 * @class None
 * Holds no value.
 *
 * @augments {Option}
 */
class None extends Option {
  constructor () {
    super();
  }

  toString () {
    return "None()";
  }
}

module.exports = { Option, Some, None };