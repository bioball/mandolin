const each = (arr, fn) => {
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i], i);
  }
};

const map = (arr, fn) => {
  var result = [];
  each(arr, (element, i) => result[i] = fn(element, i))
  return result;
};

const reduce = (arr, fn, seed) => {
  var result = seed;
  each(arr, (element, i) => result = fn(result, element, i));
  return result;
}

const abstractClassCheck = (currentThis, target, name) => {
  if (currentThis.constructor === target) {
    throw new Error(`Cannot instantiate abstract class ${ name }`)
  }
};

const extend = (obj1, ...rest) => {
  const extendOnce = (a, b) => {
    for (var key in b) {
      a[key] = b[key];
    }
    return a;
  };
  return reduce(rest, extendOnce, obj1);
};

const capitalize = (str) => {
  return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase();
};

module.exports = { each, reduce, abstractClassCheck, extend, capitalize };