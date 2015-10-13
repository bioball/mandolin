/**
 * Mandolin
 * @author Daniel Chao
 *
 * Mandolin is a library that provides Monadic data types, as well as an easy way to interop with them.
 */

const { Option, Some, None } = require('./dist/Option');
const { Either, Left, Right } = require('./dist/Either');
const Parser = require('./dist/Parser');
const Reads = require('./dist/Reads');
const utils = require('./dist/internal/utils');
const utility = require('./dist/utility');

module.exports = utils.extend(utility, { Option, Some, None, Either, Left, Right, Parser, Reads });