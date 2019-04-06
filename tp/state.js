var { _hash } = require("./lib");
var { TP_NAMESPACE } = require("./constants");

class NotaryState {
  constructor(context) {
    this.context = context;
    this.timeout = 500;
    this.stateEntries = {};
  }

  /**
   *
   * @param {Object} value
   * value.house = id of the house
   * value.buyer = buyer's name
   * value.seller = seller's name
   */
  setValue(value) {
    var houseAddress = value.house;
    var address = makeAddress(houseAddress);
    var stateEntriesSend = {};

    stateEntriesSend[address] = value;

    return this.context
      .setState(stateEntriesSend, this.timeout)
      .then(function(result) {
        console.log("Success", result);
      })
      .catch(function(error) {
        console.error("Error", error);
      });
  }

  /**
   *
   * @param {String} houseAddress
   * houseAddress = id of the house
   */
  getValue(houseAddress) {
    var address = makeAddress(houseAddress);
    return this.context.getState([address], this.timeout).then(
      function(stateEntries) {
        Object.assign(this.stateEntries, stateEntries);
        console.log(this.stateEntries[address].toString());
        return this.stateEntries;
      }.bind(this)
    );
  }
}

const makeAddress = (x, label) => TP_NAMESPACE + _hash(x);

module.exports = NotaryState;
