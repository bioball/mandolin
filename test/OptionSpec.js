const { expect } = require('chai');
const { Option, Some, None } = require('../src/Option');
const Reads = require('../src/Reads');

describe('Option', function(){

  it('is an abstract class', function(){
    expect(() => new Option("foo")).to.throw()
  });

  it("has these methods", function(){
    expect(Option).to.respondTo("isSome");
    expect(Option).to.respondTo("isNone");
    expect(Option).to.respondTo("get");
    expect(Option).to.respondTo("map");
    expect(Option).to.respondTo("flatMap");
    expect(Option).to.respondTo("getOrElse");
    expect(Option).to.respondTo("match");
    expect(Option).itself.to.respondTo("as");
  });

  describe('Some', function(){
    it("knows it is a Some", function(){
      const opt = new Some("foo");
      expect(opt.isSome()).to.be.true;
      expect(opt.isNone()).to.be.false;
    });

    it('will map', function(){
      const opt = new Some("foo").map(function(val){
        expect(val).to.equal("foo");
        return val;
      });
      expect(opt.get()).to.equal("foo");
    });

    it('will flatMap', function(){
      new Some("foo").flatMap((v) => new Some(v + "bar")).match({
        Some (v) { expect(v).to.equal("foobar"); },
        None () { throw new Error("Somehow got a None"); }
      });
    });

  });

  describe('None', function(){
    it("knows it is a None", function(){
      const opt = new None();
      expect(opt.isNone()).to.be.true;
      expect(opt.isSome()).to.be.false;
    });

    it('will not map', function(){
      const opt = new None();
      opt.map(function(){
        throw new Error();
      });
    });
  });

  describe("Option.reads", function(){
    it("reads null and undefined as None", function(){
      expect(Option.reads.getValue(null).get().isNone()).to.be.true;
      expect(Option.reads.getValue(undefined).get().isNone()).to.be.true;
    });

    it("reads any other value as a Some", function(){
      expect(Option.reads.getValue(5).get().isSome()).to.be.true;
      expect(Option.reads.getValue(5).get().isNone()).to.be.false;

      expect(Option.reads.getValue(new Error("Foo")).get().isSome()).to.be.true;
      expect(Option.reads.getValue([1,2,3]).get().isNone()).to.be.false;
    });

    it("can compose with another Reads", function(){
      const optString = Option.as(Reads.string);
      optString.getValue("foo").match({
        Left (err) { throw err; },
        Right (v) { expect(v.get()).to.equal("foo") }
      });
    });

    it("returns a Left(None) if the other Reads fails", function(){
      const optString = Option.as(Reads.string);
      optString.getValue(3).match({
        Right (v) { 
          console.log("got value: " + v);
          throw v;
        },
        Left (err) {
          console.log(err + "");
        }
      })
    });

  });

  describe("deserializing", function(){
    const obj = {
      opt: new Some("bar")
    };
    expect(JSON.stringify(obj)).to.equal('{"opt":"bar"}');
  })

});