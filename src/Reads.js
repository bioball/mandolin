const { Left, Right } = require('./Either');
const utils = require('./internal/utils');

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
   * @return {Reads}
   */
  flatMap (f) {
    return new Reads((v) => this.getValue(v).flatMap(f));
  }

  /**
   * Compose on an unsuccessful read.
   * @param  {(A) => A} r The next reader to perform
   * @return {Reads}
   */
  mapLeft (f) {
    return new Reads((v) => this.getValue(v).mapLeft(f))
  }

  /**
   * Compose on an unsuccessful read.
   * @param  {(A) => Either<A>} r The next reader to perform
   * @return {Reads}
   */
  flatMapLeft (f) {
    return new Reads((v) => this.getValue(v).flatMapLeft(f))
  }


  /**
   * Compose one read with another.
   * @param {Reads} r 
   * @return {Reads}
   */
  chain (r) {
    return this.flatMap(r.getValue);
  }

  /**
   * Compose one read with another on the left.
   * @param {Reads} r 
   * @return {Reads}
   */
  chainLeft (r) {
    return this.flatMapLeft(r.getValue);
  }

  /**
   * Return the result of running the reader.
   * @return {Either}
   */
  getValue (v) {
    return this.reader(v);
  }

}

Reads.unit = (reader) => new Reader(reader);

Reads.instance = function (T) {
  return new Reads(function (v) {
    if (v instanceof T) {
      return new Right(v);
    }
    return new Left(new Error(`Expected an instance of ${ T }, but instead got ${ v }`));
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
    return new Left(new Error(`Attempted to read value as ${ utils.capitalize(t) }, but instead got ${ v }`));
  });
});

Reads.array = new Reads(function (v) {
  if (Array.isArray(v)) {
    return new Right(v);
  }
  return new Left(new Error(`Attempted to read value as Array, but instead got ${ v }`));
});

module.exports = Reads;