const { Option, Some, None } = require('./src/Option');
const { Either, Left, Right } = require('./src/Future');
const Parser = require('./src/Parser');
const Reads = require('./src/Reads');
const utils = require('./src/internals/utils');

module.exports = { Option, Some, None, Either, Left, Right, Parser, Reads };

// Apply helper methods onto the main export. This adds `define`, `string`, `boolean`, etc.
utils.extend(module.exports, Reads, Parser);