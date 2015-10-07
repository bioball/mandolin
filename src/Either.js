/**
 * @class Either
 * A disjunt union type of Left and Right, and is right-biased; `map` and `flatMap` are only called if it is a Right. The difference between this and an Option, is that a Left can also hold values.
 */
class Either {

  constructor (val = null) {
    this.val = val;
  }

  isLeft () {
    return this instanceof Left;
  }

  isRight () {
    return this instanceof Right;
  }

  /**
   * Serializes a value into an Either of its type.
   *
   * @example
   * Either.as(String, String)("foo")
   * // => Right("foo")
   * Either.as(Number, String)(5)
   * // => Left(5)
   * 
   */
  as (A, B) {
    return (val) => {
      if (val instanceof B) {
        return new Right(val);
      }
      if (val instanceof A) {
        return new Left(val);
      }
      throw new Exception(`Could not serialize value %o as an Option of %{ T }`, val)
    }
  }


  /**
   * @private
   */
  get () {
    if (this.isRight()) {
      return this.val;
    }
    throw new Exception("Performed a get on a Left")
  }

  /**
   * @private
   */
  getLeft () {
    if (this.isLeft()) {
      return this.val;
    }
    throw new Exception("Performed a getLeft on a Right")
  }

  /**
   * Return a new option type based on running f.
   *
   * @example
   * Right("Barry")
   * .map((n) => n + " Bonds")
   * // => Right("Barry Bonds")
   * 
   * @param  {(A) => A} f 
   * @return {Either[_, A]}
   */
  map (f) {
    if (this.isRight()) {
      return new Right(f(this.val));
    }
    return this;
  }

  flatMap (f) {
    if (this.isRight()) {
      return f(this.val());
    }
    return this;
  }

  getOrElse (f) {
    if (this.isRight()) {
      return this.get();
    }
    return f(this.getLeft());
  }

  /**
   * Helper for operations on options. Calling `match` is the same thing as chaining `map` and `getOrElse`.
   * 
   * @example
   * new Right(3).match({
   *   Right (a) {
   *     return a + 5;
   *   },
   *   Left () {
   *     return 0;
   *   }
   * });
   * // => 8
   */
  match ({ Left, Right }) {
    return this.map(Right).getOrElse(Left);
  }

}

class Left extends Either {
  constructor (val) {
    super(val);
  }
}

class Right extends Either {
  constructor (val) {
    super(val);
  }
}

module.exports = { Either, Left, Right };