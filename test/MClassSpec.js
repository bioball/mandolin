const MClass = require('../src/MClass');
const { expect } = require('chai');

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

});