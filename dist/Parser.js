'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./Either');

var Either = _require.Either;
var Left = _require.Left;
var Right = _require.Right;

var utils = require('./internal/utils');
var Reads = require('./Reads');

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

var Parser = (function (_Reads) {
  _inherits(Parser, _Reads);

  function Parser() {
    var definition = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var path = arguments.length <= 1 || arguments[1] === undefined ? ["obj"] : arguments[1];

    _classCallCheck(this, Parser);

    _get(Object.getPrototypeOf(Parser.prototype), 'constructor', this).call(this);
    this.definition = definition;
    this.path = path;
  }

  /**
   * @override
   */

  _createClass(Parser, [{
    key: 'getValue',
    value: function getValue(target) {
      return this.parse(target);
    }

    /**
     * This is for error debugging when a parse fails.
     */
  }, {
    key: 'setPath',
    value: function setPath(name) {
      return new Parser(this.definition, this.path.concat([name]));
    }

    /**
     * @private
     */
  }, {
    key: 'getRead',
    value: function getRead(read, key) {
      return read instanceof Parser ? read.setPath(key) : read;
    }

    /**
     * @private
     */
  }, {
    key: 'applyErrorPath',
    value: function applyErrorPath(key) {
      var _this = this;

      return function (err) {
        var route = _this.path.concat([key]).join(".");
        return new Error(route + ': ' + err.message);
      };
    }

    /**
     * @param  {Object} target  The object that needs to be parsed
     * @return {Either<Error, A>}
     */
  }, {
    key: 'parse',
    value: function parse() {
      var _this2 = this;

      var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return utils.reduce(Object.keys(this.definition), function (result, key) {
        if (result.isLeft()) {
          return result;
        }
        var read = _this2.definition[key];
        var value = target[key];
        return result.flatMap(function (obj) {
          return _this2.getRead(read, key).getValue(value).map(function (v) {
            return utils.extend(obj, _defineProperty({}, key, v));
          });
          // .mapLeft(this.applyErrorPath(key));
        });
      }, new Right({}));
    }
  }]);

  return Parser;
})(Reads);

;

module.exports = Parser;