const { Left, Right } = require('./Either');

const extend = (obj1, obj2) => {
  for (var key in obj2) {
    obj1[key] = obj2[key];
  }
};

const getValue = (obj, value, typeDef, key) => {
  if (value instanceof typeDef[key]) {
    obj[key] = value;
    return new Right(obj);
  }
  if (typeof typeDef[key] === "function") {
    obj[key] = typeDef[key](value);
    return new Right(obj);
  }
  return Left(new Error("Failed to deserialize property ${ key }"));
};

/**
 * Given a typedef object and a set of values, deserialize them.
 * 
 * @return {Either<Error, Object>}
 */
const deserialize = (typeDef, properties) => {
  return Object.keys(typeDef).reduce((either, key) => {
    if (either.isLeft()) {
      return either;
    }
    return either.flatMap((obj) => getValue(obj, properties[key], typeDef, key));
  }, new Right({}));
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