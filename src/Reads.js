// This should be freely composable. e.g.
// const r = new Reads(function(v){ return new Right(v) });
// const s = new Reads(function(v){ return new Right(v) });
// r.map(s)
// 
// Calls to `map` and `flatMap` are lazy. They don't do anything until `getValue` is called.

const { Left, Right } = require('./Either');

class Reads {
  /**
   * @param  {(Any) => Either} reader 
   */
  constructor (reader) {
    this.reader = reader;
    this.getValue = this.getValue.bind(this);
    this.map = this.map.bind(this);
  }

  /**
   * Compose on a successful read.
   * @param  {(A) => A} r The next reader to perform
   * @return {Reads}
   */
  map (f) {
    return new Reads((v) => this.getValue(v).map(f))
  }

  /**
   * Compose on a successful read.
   * @param  {(A) => Either} r The next reader to perform
   */
  flatMap (f) {
    return new Reads((v) => this.getValue(v).flatMap(f));
  }

  /**
   * Compose one read with another.
   */
  chain (r) {
    return this.flatMap(r.getValue);
  }

  /**
   * Return the result of running the reader.
   * @return {Either}
   */
  getValue (v) {
    return this.reader(v);
  }

}

Reads.instance = function (T) {
  return new Reads(function (v) {
    if (v instanceof T) {
      return new Right(v);
    }
    return new Left(v);
  });
};

/**
 * Define baked-in Reads for JavaScript primitives.
 *
 * Reads.string
 * Reads.boolean
 * Reads.number
 * Reads.object
 * Reads.undefined
 * Reads.null
 */
[
  "string",
  "boolean",
  "number",
  "object",
  "null",
  "undefined"
].forEach((t) => {
  Reads[t] = new Reads(function (v) {
    if (typeof v === t) {
      return new Right(v);
    }
    return new Left(new Error(`Attempted to read value as ${ t.toUpperCase() }, but instead got ${ v }`));
  });
});

Reads.array = new Reads(function (v) {
  if (Array.isArray(v)) {
    return new Right(v);
  }
  return new Left(new Error(`Attempted to read value as Array, but instead got ${ v }`));
});

module.exports = Reads;