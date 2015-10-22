const m = require('mandolin');
const _ = require('lodash');
const { Some, None, Option } = m;

const addressDef = m.define({
  "Address 1": m.string,
  "Address 2": Option.as(m.string),
  "City": m.string,
  "Country": m.string
});

const userDef = m.define({
  firstName: Option.as(m.string),
  lastName: Option.as(m.string),
  email: Option.as(m.string),
  age: m.number,
  address: Option.as(addressDef)
});

class User {
  constructor (properties) {
    _.extend(this, properties);
  }
}

User.create = function (raw) {
  return userDef.parse(raw).map((data) => new User(data))
};

module.exports = User;