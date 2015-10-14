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
  with (r) {
    return this.flatMap(r.getValue);
  }

  /**
   * Compose one read with another on the left.
   * @param {Reads} r 
   * @return {Reads}
   */
  withLeft (r) {
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

module.exports = Reads;