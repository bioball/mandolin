'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('./Either');

var Left = _require.Left;
var Right = _require.Right;

var utils = require('./internal/utils');

var Reads = (function () {
  /**
   * @param  {(Any) => Either} reader 
   */

  function Reads(reader) {
    _classCallCheck(this, Reads);

    this.reader = reader;
    this.getValue = this.getValue.bind(this);
    this.map = this.map.bind(this);
  }

  /**
   * Compose on a successful read.
   * @param  {(A) => A} r The next reader to perform
   * @return {Reads}
   */

  _createClass(Reads, [{
    key: 'map',
    value: function map(f) {
      var _this = this;

      return new Reads(function (v) {
        return _this.getValue(v).map(f);
      });
    }

    /**
     * Compose on a successful read.
     * @param  {(A) => Either} r The next reader to perform
     * @return {Reads}
     */
  }, {
    key: 'flatMap',
    value: function flatMap(f) {
      var _this2 = this;

      return new Reads(function (v) {
        return _this2.getValue(v).flatMap(f);
      });
    }

    /**
     * Compose on an unsuccessful read.
     * @param  {(A) => A} r The next reader to perform
     * @return {Reads}
     */
  }, {
    key: 'mapLeft',
    value: function mapLeft(f) {
      var _this3 = this;

      return new Reads(function (v) {
        return _this3.getValue(v).mapLeft(f);
      });
    }

    /**
     * Compose on an unsuccessful read.
     * @param  {(A) => Either<A>} r The next reader to perform
     * @return {Reads}
     */
  }, {
    key: 'flatMapLeft',
    value: function flatMapLeft(f) {
      var _this4 = this;

      return new Reads(function (v) {
        return _this4.getValue(v).flatMapLeft(f);
      });
    }

    /**
     * Compose one read with another.
     * @param {Reads} r 
     * @return {Reads}
     */
  }, {
    key: 'chain',
    value: function chain(r) {
      return this.flatMap(r.getValue);
    }

    /**
     * Compose one read with another on the left.
     * @param {Reads} r 
     * @return {Reads}
     */
  }, {
    key: 'chainLeft',
    value: function chainLeft(r) {
      return this.flatMapLeft(r.getValue);
    }

    /**
     * Return the result of running the reader.
     * @return {Either}
     */
  }, {
    key: 'getValue',
    value: function getValue(v) {
      return this.reader(v);
    }
  }]);

  return Reads;
})();

Reads.unit = function (reader) {
  return new Reader(reader);
};

module.exports = Reads;