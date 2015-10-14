const utils = require('./internal/utils');

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
      return this.map(f).flatten();
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
      return this.mapLeft(f).flatten();
    }
    return this;
  }

  /**
   * Turns an Either<Either> to an Either.
   */
  flatten () {
    if (this.isRight() && this.get() instanceof Either) {
      return this.get();
    }
    if (this.isLeft() && this.getLeft() instanceof Either) {
      return this.getLeft();
    }
    return this;
  }



  /**
   * If Left, switch to Right. If Right, switch to left.
   * @return {Either}
   */
  flip () {
    return this.isLeft() ? this.toRight() : this.toLeft();
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

  toJSON () {
    return this.val;
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
   * Cast this to an Option type. A Left becomes a None, a Right becomes a Some.
   * If this is a Left, the value will be lost.
   * 
   * @return {Option}
   */
  toOption () {
    const { Option, Some, None } = require('./Option');
    return this.match({
      Left () { return new None() },
      Right(val) { return new Some(val) }
    });
  }

  /**
   * Cast this to a Promise. A Left becomes a Promise rejection, a Right becomes a Promise resolve.
   * @return {Promise}
   */
  toPromise () {
    return this.match({
      Left (val) { return Promise.reject(val); },
      Right (val) { return Promise.resolve(val); }
    });
  }

}

/**
 * @alias flatMap
 */
Either.prototype.chain = Either.prototype.flatMap;


/**
 * Read in an either, given a Reads for the left, and a Reads for the right. 
 * If the reads for the right returns a Left, it will return the Reads for the left.
 *
 * @example
 * const readAsError = Reads.unit((v) => Right.unit(new Error(v)))
 * const definition = M.define({
 *   foo: Either.as(readAsError, M.number)
 * })
 *
 * definition.parse({ foo: 5 })
 * // => Right(Right(5))
 * definition.parse({ foo: "blah" })
 * // => Right(Left(Error("blah")))
 * 
 * 
 * @param  {Reads} readLeft  The Reads for the left
 * @param  {Reads} readRight The Reads for the right
 * @return {Reads}
 */
Either.as = (readLeft, readRight) => {
  const Reads = require('./Reads');
  return new Reads((v) => {
    return readRight
      .map(Right.unit)
      .flatMapLeft(() => readLeft.getValue(v).map(Left.unit));
  });
};

/**
 * @class Left
 * @augments {Either}
 */
class Left extends Either {
  constructor (val) {
    super(val);
  }

  toString () {
    return `Left(${ this.val })`;
  }
}

Left.unit = Left.of = (v) => new Left(v);

/**
 * @class Right
 * @augments {Either}
 */
class Right extends Either {
  constructor (val) {
    super(val);
  }

  toString () {
    return `Right(${ this.val })`;
  }
}

Right.unit = Right.of = (v) => new Right(v);

module.exports = { Either, Left, Right };