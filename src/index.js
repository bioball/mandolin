const { Option, Some, None } = require('./Option');
const { Either, Left, Right } = require('./Either');
const Parser = require('./Parser');
const Reads = require('./Reads');
const utils = require('./internal/utils');
const utility = require('./utility');

module.exports = utils.extend(utility, { Option, Some, None, Either, Left, Right, Parser, Reads });