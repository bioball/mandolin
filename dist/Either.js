"use strict";

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./internal/utils');

/**
 * @class Either
 * @abstract
 * 
 * A disjoint union of Left and Right, and is right-biased. `map` and `flatMap` are only called if it is a Right. 
 * This is similar to an Option, in that `Left : None :: Right : Some`. The difference is that a Left can also hold values.
 *
 * An Either does not hold two values. Rather, it holds one value, which is either a Left or a Right.
 */

var Either = (function () {
  function Either() {
    var val = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Either);

    utils.abstractClassCheck(this, Either, "Either");
    this.val = val;
  }

  /**
   * @alias flatMap
   */

  _createClass(Either, [{
    key: "isLeft",
    value: function isLeft() {
      return this instanceof Left;
    }
  }, {
    key: "isRight",
    value: function isRight() {
      return this instanceof Right;
    }

    /**
     * @private
     */
  }, {
    key: "get",
    value: function get() {
      if (this.isRight()) {
        return this.val;
      }
      throw new Error("Performed a get on a Left");
    }

    /**
     * @private
     */
  }, {
    key: "getLeft",
    value: function getLeft() {
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
  }, {
    key: "map",
    value: function map(f) {
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
  }, {
    key: "flatMap",
    value: function flatMap(f) {
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
  }, {
    key: "mapLeft",
    value: function mapLeft(f) {
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
  }, {
    key: "flatMapLeft",
    value: function flatMapLeft(f) {
      if (this.isLeft()) {
        return this.mapLeft(f).flatten();
      }
      return this;
    }

    /**
     * Turns an Either<Either> to an Either.
     */
  }, {
    key: "flatten",
    value: function flatten() {
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
  }, {
    key: "flip",
    value: function flip() {
      return this.isLeft() ? this.toRight() : this.toLeft();
    }
  }, {
    key: "getOrElse",
    value: function getOrElse(f) {
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
  }, {
    key: "match",
    value: function match(_ref) {
      var Left = _ref.Left;
      var Right = _ref.Right;

      return this.map(Right).getOrElse(Left);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.val;
    }

    /**
     * Cast this to a Right.
     * @return {Right}
     */
  }, {
    key: "toRight",
    value: function toRight() {
      return new Right(this.val);
    }

    /**
     * Cast this to a Left.
     * @return {Left}
     */
  }, {
    key: "toLeft",
    value: function toLeft() {
      return new Left(this.val);
    }

    /**
     * Cast this to an Option type. A Left becomes a None, a Right becomes a Some.
     * If this is a Left, the value will be lost.
     * 
     * @return {Option}
     */
  }, {
    key: "toOption",
    value: function toOption() {
      var _require = require('./Option');

      var Option = _require.Option;
      var Some = _require.Some;
      var None = _require.None;

      return this.match({
        Left: function Left() {
          return new None();
        },
        Right: function Right(val) {
          return new Some(val);
        }
      });
    }

    /**
     * Cast this to a Promise. A Left becomes a Promise rejection, a Right becomes a Promise resolve.
     * @return {Promise}
     */
  }, {
    key: "toPromise",
    value: function toPromise() {
      return this.match({
        Left: function Left(val) {
          return Promise.reject(val);
        },
        Right: function Right(val) {
          return Promise.resolve(val);
        }
      });
    }
  }]);

  return Either;
})();

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
Either.as = function (readLeft, readRight) {
  var Reads = require('./Reads');
  return new Reads(function (v) {
    return readRight.map(Right.unit).flatMapLeft(function () {
      return readLeft.getValue(v).map(Left.unit);
    });
  });
};

/**
 * @class Left
 * @augments {Either}
 */

var Left = (function (_Either) {
  _inherits(Left, _Either);

  function Left(val) {
    _classCallCheck(this, Left);

    _get(Object.getPrototypeOf(Left.prototype), "constructor", this).call(this, val);
  }

  _createClass(Left, [{
    key: "toString",
    value: function toString() {
      return "Left(" + this.val + ")";
    }
  }]);

  return Left;
})(Either);

Left.unit = Left.of = function (v) {
  return new Left(v);
};

/**
 * @class Right
 * @augments {Either}
 */

var Right = (function (_Either2) {
  _inherits(Right, _Either2);

  function Right(val) {
    _classCallCheck(this, Right);

    _get(Object.getPrototypeOf(Right.prototype), "constructor", this).call(this, val);
  }

  _createClass(Right, [{
    key: "toString",
    value: function toString() {
      return "Right(" + this.val + ")";
    }
  }]);

  return Right;
})(Either);

Right.unit = Right.of = function (v) {
  return new Right(v);
};

module.exports = { Either: Either, Left: Left, Right: Right };