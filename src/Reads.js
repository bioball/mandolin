// This should be freely composable. e.g.
// const r = new Reads(function(v){ return new Right(v) });
// const s = new Reads(function(v){ return new Right(v) });
// r.map(s)
// 
// Calls to `map` and `flatMap` are lazy. They don't do anything until `getValue` is called.

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
   * @param  {Reads} r The next reads to perform
   * @return {Reads}
   */
  map (r) {
    return new Reads(() => this.getValue().flatMap(r.getValue));
  }

  /**
   * Compose on both successful and unsuccessful reads
   * @param  {Reads} r The next reads to perform
   * @return {Reads}
   */
  chain (r) {
    return new Reads(() => this.getValue().map(r.getValue).mapLeft(r.getValue));
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
  return new Reads(function(v){
    if (v instanceof T) {
      return new Right(v);
    }
    return new Left(v);
  });
};

module.exports = Reads;