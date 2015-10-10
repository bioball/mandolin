const { expect } = require('chai');
const { Option, Some, None } = require('../src/Option');

describe('Options', function(){
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

    });
  });
});