const Parser = require('../src/Parser');
const M = require('../src/Reads');
const { Option } = require('../src/Option');
const { expect } = require('chai');

/**
 * @todo Actually provide this in the library somewhere
 */
M.define = function(def){
  return new Parser(def);
}

describe('Parser', function(){
  it('is a thing', function(){
    expect(Parser).to.exist;
  });

  it('can parse', function(){
    const parser = new Parser({
      "firstName": M.string,
      "lastName": M.string,
      "email": Option.as(M.string)
    });
    parser.parse({
      "firstName": "Nathan",
      "lastName": "Drake",
      "email": "nathan@drake.com"
    }).match({
      Right (nate) {
        expect(nate).to.have.property("firstName", "Nathan");
        expect(nate).to.have.property("lastName", "Drake");
        expect(nate.email.get()).to.equal("nathan@drake.com");
      },
      Left (err) {
        throw err;
      }
    });
  });

  it('can parse nested objects', function(){
    const definition = {
      "firstName": M.string,
      "lastName": M.string,
      "email": Option.as(M.string),
      "address": M.define({
        "street1": M.string,
        "street2": Option.as(M.string)
      })
    };
    M.define(definition).parse({
      "firstName": "Nathan",
      "lastName": "Drake",
      "email": "nathan@drake.com",
      "address": {
        "street1": "123 Pennsylvania St.",
        "street2": "Apt. 3"
      }
    }).match({
      Right (nate) {
        expect(nate).to.have.property("firstName", "Nathan");
        expect(nate).to.have.property("lastName", "Drake");
        expect(nate.email.get()).to.equal("nathan@drake.com");
        expect(nate).to.have.deep.property("address.street1", "123 Pennsylvania St.");
        expect(nate.address.street2.get()).to.equal("Apt. 3");
      },
      Left (err) {
        throw err;
      }
    })
  })
});