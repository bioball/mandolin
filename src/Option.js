/**
 * @class Option
 * A monadic type for values that might not exist. Using option types will guarantee that you will not have null exception.
 * 
 * This library is heavily inpsired by Scala's native Option type.
 */
class Option {

  constructor (val = null) {
    this.val = val;
  }

  isSome () {
    return this.val !== null;
  }

  isNone () {
    return this.val === null;
  }

  as (T) {
    return (val) => {
      if (val === null) {
        return new None();
      }
      if (val instanceof T) {
        return new Some(val);
      }
      throw new Exception(`Could not serialize value %o as an Option of %{ T }`, val)
    }
  }


  /**
   * @private
   */
  get () {
    if (this.isSome()) {
      return this.val;
    }
    throw new Exception("Performed a get on a None type")
  }

  /**
   * Return a new option type based on running f.
   * @param  {(A) => A} f 
   * @return {Option[A]}
   */
  map (f) {
    if (this.isSome()) {
      return Option(f(this.val));
    }
    return this;
  }

  /**
   * Return a new option type given a function that returns an Option type.
   *
   * @example
   * foo.flatMap((val) => {
   *   return new Option(val.toOther());
   * })
   * 
   * @param  {(A) => Option(A)} f
   * @return {A}
   */
  flatMap (f) {
    if (this.isSome()) {
      return f(this.val());
    }
    return this;
  }

  /**
   * If this is a some, returns the value. Otherwise, returns the return value of `f`.
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
   * foo.match({
   *   some (bar) {
   *     return doThingWithBar(bar);
   *   },
   *   none () {
   *     return doThingWhenNone();
   *   }
   * });
   * 
   * @param  {(A) => A} options.some    
   * @param  {() => A} options.none
   * @return {A} The value itself.
   */
  match ({ some, none }) {
    return this.map(some).getOrElse(none);
  }

}

class Some extends Option {
  constructor (val) {
    if (!this instanceof Some) {
      return new Some(val);
    }
    super(val);
  }
}

class None extends Option {
  constructor () {
    if (!this instanceof None) {
      return new None();
    }
    super();
  }
}

module.exports = { Option, Some, None };