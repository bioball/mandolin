module.exports.abstractClassCheck = (currentThis, target, name) => {
  if (currentThis.constructor === target) {
    throw new Error(`Cannot instantiate abstract class ${ name }`)
  }
};

module.exports.extend = (obj1, ...rest) => {
  const extendOnce = (a, b) => {
    for (var key in b) {
      a[key] = b[key];
    }
    return a;
  };
  return rest.reduce((acc, obj) => extendOnce(acc, obj), obj1);
};