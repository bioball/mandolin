const MClass = require('../src/MClass');
const { expect } = require('chai');
const { Option, Some, None } = require('../src/Option');

describe("MClass", function(){

  it("should be able to create a Person class", function(){
    this.Person = MClass.createClass({
      firstName: String,
      lastName: String
    });
    expect(this.Person).to.be.a('function');
    const bob = new this.Person({
      firstName: "Bob",
      lastName: "Macklemore"
    });
    expect(bob).to.have.property("firstName", "Bob");
    expect(bob).to.have.property("lastName", "Macklemore");
  });

  it("should throw if you attempt to create a person using invalid types", function(){
    expect(() => {
      new Person({
        firstName: 35,
        lastName: null
      })
    }).to.throw();
  });

  it("will deserialize monadic types", function(){
    const House = MClass.createClass({
      street: Option.as(String),
      streetNumber: Option.as(Number)
    });

    House.parseFromJsObj({
      street: "Somewhere over the rainbow",
      streetNumber: undefined
    }).match({
      Right (house) {
        console.log(house);
        expect(house).to.be.an.instanceof(House);
        expect(house.street.isSome()).to.be.true;
        expect(house.street.get()).to.equal("Somewhere over the rainbow");
        expect(house.streetNumber.isNone()).to.be.true;
      },
      Left (err) {
        throw err;
      }
    });

  })

});