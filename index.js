/**
 * Mochi.js
 * @author Daniel Chao
 *
 * Mochi is a library that provides Monadic data types, as well as an easy way to interop with them.
 */

const { Option, Some, None } = require('./src/Option');
const { Either, Left, Right } = require('./src/Either');
const Parser = require('./src/Parser');
const Reads = require('./src/Reads');
const utils = require('./src/internal/utils');
const utility = require('./src/utility');

module.exports = utils.extend(utility, { Option, Some, None, Either, Left, Right, Parser, Reads });