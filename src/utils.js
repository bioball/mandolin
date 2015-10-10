module.exports.abstractClassCheck = (current, target, name) => {
  if (current === target) {
    throw new Error(`Cannot instantiate abstract class ${ name }`)
  }
};

module.exports.extend = (obj1, obj2) => {
  for (var key in obj2) {
    obj1[key] = obj2[key];
  }
};