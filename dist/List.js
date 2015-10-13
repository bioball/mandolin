'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var utils = require('./internal/utils');

/**
 * @class List
 * A List monad is basically an Array, except Arrays are missing a `flatMap`.
 */

var List = (function () {
  function List() {
    _classCallCheck(this, List);

    for (var _len = arguments.length, val = Array(_len), _key = 0; _key < _len; _key++) {
      val[_key] = arguments[_key];
    }

    this.val = val;
  }

  _createClass(List, [{
    key: 'map',
    value: function map(f) {
      return utils.map(this.values, f);
    }
  }, {
    key: 'flatMap',
    value: function flatMap(f) {
      return this.map(f).flatten();
    }
  }, {
    key: 'flatten',
    value: function flatten() {}
  }]);

  return List;
})();