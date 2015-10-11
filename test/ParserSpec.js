const Parser = require('../src/Parser');
const utils = require('../src/internal/utils');
const M = utils.extend({}, require('../src/Reads'), Parser);
const { Option } = require('../src/Option');
const { expect } = require('chai');

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
  });

  it('will error if one of its reads fails', function(){
    const definition = { "Admiral": M.string };
    M.define(definition).parse({ "Admiral": 3 }).match({
      Right (admiral) { throw admiral; },
      Left (err) { console.log(err); }
    });
  });

  // it('will track the path of the error in deeply nested objects', function(){
  //   const foo = M.define({
  //     bar: M.define({
  //       baz: M.define({
  //         biz: M.define({
  //           qux: M.string
  //         })
  //       })
  //     })
  //   });

  //   foo.parse({
  //     bar: {
  //       baz: {
  //         biz: {
  //           qux: 5
  //         }
  //       }
  //     }
  //   }).match({
  //     Left (err) {
  //       console.log(err.message);
  //       expect(err.message).to.match(/obj\.bar\.baz\.biz\.qux/)
  //     },
  //     Right (obj) { throw obj; }
  //   })

  // })
});