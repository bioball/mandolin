/**
 * @class Either
 * A disjoint union of Left and Right, and is right-biased. `map` and `flatMap` are only called if it is a Right. 
 * The difference between this and an Option, is that a Left can also hold values.
 *
 * An Either does not hold two values. Rather, it holds one value, which is either a Left or a Right.
 */
class Either {

  constructor (val = null) {
    if (this instanceof Either) {
      throw new Error("An Either type should be instantiated using `new Left()` or `new Right()`");
    }
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
   * Return a new Either based on running f.
   *
   * @example
   * Right("Barry")
   * .map((n) => n + " Bonds")
   * // => Right("Barry Bonds")
   * 
   * @param  {(A) => A} f 
   * @return {Either}
   */
  map (f) {
    if (this.isRight()) {
      return new Right(f(this.val));
    }
    return this;
  }

  /**
   * Return a new Either based on running f.
   *
   * @example
   * Right("Chuck")
   * .flatMap((n) => new Right(n + " Norris"))
   * // => Right("Chuck Norris")
   * 
   * @param  {(A) => Either} f
   * @return {Either}
   */
  flatMap (f) {
    if (this.isRight()) {
      return f(this.val);
    }
    return this;
  }

  /**
   * Compose on the left
   *
   * @example
   * Left("Chuck")
   * .map((n) => n + " Norris")
   * // => Left("Chuck Norris")
   *
   * @param  {(A) => A} f 
   * @return {Either}
   */
  mapLeft (f) {
    if (this.isLeft()) {
      return new Left(f(this.val));
    }
    return this;
  }

  /**
   * Compose on the left
   * @param  {(A) => Either} f
   * @return {Either}
   */
  flatMapLeft (f) {
    if (this.isLeft()) {
      return f(this.val);
    }
    return this;
  }


  /**
   * Cast this to a Right.
   * @return {Right}
   */
  toRight () {
    return new Right(this.val);
  }

  /**
   * Cast this to a Left.
   * @return {Left}
   */
  toLeft () {
    return new Left(this.val);
  }

  /**
   * If Left, switch to Right. If Right, switch to left.
   * @return {Either}
   */
  flip () {
    return this.isLeft() ? this.toRight() : this.toLeft();
  }

  flatMap (f) {
    if (this.isRight()) {
      return f(this.val);
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