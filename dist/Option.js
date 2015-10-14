'use strict';

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var utils = require('./internal/utils');
var Reads = require('./Reads');

var _require = require('./Either');

var Left = _require.Left;
var Right = _require.Right;
var Either = _require.Either;

/**
 * @class Option
 * @abstract
 * A monadic type for values that might not exist. Using Options eliminates the need to use a null value.
 * 
 * This library is heavily inpsired by Scala's native Option type.
 */

var Option = (function () {
  function Option() {
    var val = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Option);

    utils.abstractClassCheck(this, Option, "Option");
    this.val = val;
  }

  /**
   * @alias flatMap
   */

  _createClass(Option, [{
    key: 'isSome',
    value: function isSome() {
      return this instanceof Some;
    }
  }, {
    key: 'isNone',
    value: function isNone() {
      return this instanceof None;
    }

    /**
     * @private
     */
  }, {
    key: 'get',
    value: function get() {
      if (this.isSome()) {
        return this.val;
      }
      throw new Error("Performed a get on a None type");
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
  }, {
    key: 'map',
    value: function map(f) {
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
  }, {
    key: 'flatMap',
    value: function flatMap(f) {
      if (this.isSome()) {
        return this.map(f).flatten();
      }
      return this;
    }

    /**
     * Turns Option(Option<A>) into Option<A>. Will not flatten deeply.
     * @return {Option}
     */
  }, {
    key: 'flatten',
    value: function flatten() {
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
  }, {
    key: 'getOrElse',
    value: function getOrElse(f) {
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
  }, {
    key: 'match',
    value: function match(_ref) {
      var Some = _ref.Some;
      var None = _ref.None;

      return this.map(Some).getOrElse(None);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.val;
    }

    /**
     * Coerce this to an Either. A Some becomes a Right, a None becomes a Left with no value.
     * @return {Either<null, A>}
     */
  }, {
    key: 'toEither',
    value: function toEither() {
      return this.match({
        Some: function Some(val) {
          return new Right(val);
        },
        None: function None() {
          return new Left();
        }
      });
    }

    /**
     * Cast this to a Promise. A None becomes a Promise rejection, a Some becomes a Promise resolve.
     * @return {Promise}
     */
  }, {
    key: 'toPromise',
    value: function toPromise() {
      return this.match({
        None: function None() {
          return Promise.reject();
        },
        Some: function Some(val) {
          return Promise.resolve(val);
        }
      });
    }
  }]);

  return Option;
})();

Option.prototype.chain = Option.prototype.flatMap;

/**
 * Generic Reads for the option type.
 * @return {Right<Option>}
 */
Option.reads = new Reads(function (val) {
  var opt = val === null || val === undefined ? new None() : new Some(val);
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
Option.as = function (read) {
  return read.map(Some.unit).mapLeft(None.unit);
};

/**
 * @class Some. 
 * Holds a value, but has no opinion on what that value is. The value can even be undefined.
 * 
 * @augments {Option}
 */

var Some = (function (_Option) {
  _inherits(Some, _Option);

  function Some(val) {
    _classCallCheck(this, Some);

    _get(Object.getPrototypeOf(Some.prototype), 'constructor', this).call(this, val);
  }

  _createClass(Some, [{
    key: 'toString',
    value: function toString() {
      return 'Some(' + this.val + ')';
    }
  }]);

  return Some;
})(Option);

Some.unit = Some.of = function (val) {
  return new Some(val);
};

/**
 * @class None
 * Holds no value.
 *
 * @augments {Option}
 */

var None = (function (_Option2) {
  _inherits(None, _Option2);

  function None() {
    _classCallCheck(this, None);

    _get(Object.getPrototypeOf(None.prototype), 'constructor', this).call(this);
  }

  _createClass(None, [{
    key: 'toString',
    value: function toString() {
      return "None()";
    }
  }]);

  return None;
})(Option);

None.unit = None.of = function () {
  return new None();
};

module.exports = { Option: Option, Some: Some, None: None };