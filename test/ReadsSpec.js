const { Either, Left, Right, Reads } = require('../');
const { expect } = require('chai');

describe('Reads', function(){

  it('is a thing', function(){
    expect(Reads).to.exist;
  });

  it('has these methods', function(){
    expect(Reads).to.respondTo('map');
    expect(Reads).to.respondTo('flatMap');
    expect(Reads).to.respondTo('getValue');
  });

  it('can take a reader, and run the result', function(){
    const readEvens = new Reads(function(num){
      if (num % 2) {
        return new Left(num);
      }
      return new Right(num);
    });
    expect(readEvens.getValue(1).isRight()).to.be.false;
    expect(readEvens.getValue(2).isRight()).to.be.true;
    expect(readEvens.getValue(3).isRight()).to.be.false;
    expect(readEvens.getValue(4).isRight()).to.be.true;
  });

  it('can compose via map', function(){
    const readEvens = new Reads((v) => v % 2 ? new Left(v) : new Right(v));
    const readEvensThenAsString = readEvens.map((v) => v.toString());
    expect(readEvensThenAsString.getValue(2).get()).to.equal("2");
    expect(readEvensThenAsString.getValue(3).isLeft()).to.be.true;
  });

  it('can compose via flatMap', function(){
    const readOdds = new Reads((v) => v % 2 ? new Right(v) : new Left(v));
    const readOddsThenAsString = readOdds.flatMap((v) => new Right(v.toString()));
    expect(readOddsThenAsString.getValue(2).isLeft()).to.be.true;
    expect(readOddsThenAsString.getValue(3).get()).to.equal("3");
  });

  it('can chain', function(){
    const readOdds = new Reads((v) => v % 2 ? new Right(v) : new Left(v));
    const readAsString = new Reads((v) => new Right(v.toString()));
    const readOddsThenAsString = readOdds.with(readAsString);
    expect(readOddsThenAsString.getValue(2).isLeft()).to.be.true;
    expect(readOddsThenAsString.getValue(3).get()).to.equal("3");
  });

});