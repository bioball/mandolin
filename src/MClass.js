const { Left, Right } = require('./Either');

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

/**
 * Given a typedef object and a set of values, deserialize them.
 * 
 * @return {Either<A, Error>}
 */
const deserialize = (typeDef, properties) => {
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

const parseFromJsObj = function (typeDef, Ctor, obj) {
  return deserialize(typeDef, obj).map((parsed) => new Ctor(parsed));
};

const withPrototype = function(Ctor, proto){
  extend(Ctor.prototype, proto);
  return Ctor;
};

const createClass = (typeDef = {}) => {
  const Ctor = function (properties = {}) {
    const _this = this;
    deserialize(typeDef, properties).match({
      Right (values) { extend(_this, values) },
      Left (err) { throw err; }
    });
  };

  Ctor.__typeDef = typeDef;
  Ctor.parseFromJsObj = parseFromJsObj.bind(typeDef, Ctor);
  Ctor.withPrototype = withPrototype.bind(Ctor);

  return Ctor;
};

module.exports = { createClass };