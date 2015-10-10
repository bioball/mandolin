module.exports.abstractClassCheck = (currentThis, target, name) => {
  if (currentThis.constructor === target) {
    throw new Error(`Cannot instantiate abstract class ${ name }`)
  }
};

module.exports.extend = (obj1, obj2) => {
  for (var key in obj2) {
    obj1[key] = obj2[key];
  }
};