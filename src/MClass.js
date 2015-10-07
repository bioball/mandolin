const { Either, Left, Right } = require('./Either');

const mapObj = (f, obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = f(obj[key], key);
    return acc;
  }, {});
};

const extend = (obj1, obj2) => {
  for (var key in obj2) {
    obj1[key] = obj2[key];
  }
};

const serialize = (typeDef, properties) => {
  try {
    const result = mapObj((value, key) => {
      if (value instanceof typeDef[key]) {
        return value;
      }
      if (typeof typeDef[key] === "function") {
        return typeDef[key](value);
      }
      throw new TypeError("Failed to initialize with property %o", key);
    }, properties);
    return new Right(result);
  } catch (err) {
    return new Left(err);
  }
};

const createClass = (typeDef = {}) => {
  const C = function (properties = {}) {
    const _this = this;
    serialize(typeDef, properties).match({
      Right (values) { extend(_this, values) },
      Left (err) { throw err; }
    });
  };

  C.__typeDef = typeDef;

  return C;
};

module.exports = { createClass };