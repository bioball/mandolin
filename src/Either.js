const utils = require('./utils');

/**
 * @class Either
 * @abstract
 * 
 * A disjoint union of Left and Right, and is right-biased. `map` and `flatMap` are only called if it is a Right. 
 * This is similar to an Option, in that `Left : None :: Right : Some`. The difference is that a Left can also hold values.
 *
 * An Either does not hold two values. Rather, it holds one value, which is either a Left or a Right.
 */
class Either {

  constructor (val = null) {
    utils.abstractClassCheck(this, Either, "Either");
    this.val = val;
  }

  isLeft () {
    return this instanceof Left;
  }

  isRight () {
    return this instanceof Right;
  }


  /**
   * @private
   */
  get () {
    if (this.isRight()) {
      return this.val;
    }
    throw new Error("Performed a get on a Left");
  }

  /**
   * @private
   */
  getLeft () {
    if (this.isLeft()) {
      return this.val;
    }
    throw new Error("Performed a getLeft on a Right");
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
   *   Right (a) { return a + 5; },
   *   Left () { return 0; }
   * });
   * // => 8
   */
  match ({ Left, Right }) {
    return this.map(Right).getOrElse(Left);
  }

}

/**
 * @todo
 * Really not sure if there should be a default rule around reading in an Either.
 */
Either.reads = function(){

};

/**
 * @class Left
 * @implements {Either}
 */
class Left extends Either {
  constructor (val) {
    super(val);
  }
}

/**
 * @class Right
 * @implements {Either}
 */
class Right extends Either {
  constructor (val) {
    super(val);
  }
}

module.exports = { Either, Left, Right };