const { expect } = require('chai');
const { Either, Left, Right } = require('../');

describe('Either', function(){

  it('is an abstract class', function(){
    expect(() => new Either("foo")).to.throw()
  });

  it("has these methods", function(){
    expect(Either).to.respondTo("isLeft");
    expect(Either).to.respondTo("isRight");
    expect(Either).to.respondTo("get");
    expect(Either).to.respondTo("map");
    expect(Either).to.respondTo("flatMap");
    expect(Either).to.respondTo("getOrElse");
    expect(Either).to.respondTo("match");
  });

  describe('Right', function(){
    it("knows it is a Right", function(){
      const r = new Right("foo");
      expect(r.isRight()).to.be.true;
      expect(r.isLeft()).to.be.false;
    });

    it('will map', function(){
      const r = new Right("foo").map(function(val){
        expect(val).to.equal("foo");
        return val;
      });
      expect(r.get()).to.equal("foo");
    });

    it('will flatMap', function(){
      new Right("foo").flatMap((v) => new Right(v + "bar")).match({
        Right (v) { expect(v).to.equal("foobar"); },
        Left () { throw new Error("Somehow got a Left"); }
      });
    });

  });

  describe('Left', function(){
    it("knows it is a Left", function(){
      const l = new Left();
      expect(l.isLeft()).to.be.true;
      expect(l.isRight()).to.be.false;
    });

    it('will not map', function(){
      const l = new Left();
      l.map(function(){
        throw new Error();
      });
    });
  });

  describe("deserializing", function(){
    const obj = {
      opt: new Right("bar")
    };
    expect(JSON.stringify(obj)).to.equal('{"opt":"bar"}');
  });

});