const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const {
  InvalidTransaction,
  InternalError
} = require("sawtooth-sdk/processor/exceptions");
const cbor = require("cbor");
const NotaryState = require("./state");
var { TP_FAMILY, TP_NAMESPACE } = require("./constants");

class NotaryHandler extends TransactionHandler {
  constructor() {
    super(TP_FAMILY, ["1.0"], [TP_NAMESPACE]);
  }

  apply(transactionProcessRequest, context) {
    let payload = cbor.decode(transactionProcessRequest.payload);
    let ns = new NotaryState(context);

    if (payload.action === "get") {
      return ns.getValue(payload.data);
    } else if (payload.action === "set") {
      return ns.setValue(payload.data);
    } else {
      throw new InvalidTransaction(
        `Action must be create, delete, or take not ${payload.action}`
      );
    }
  }
}

module.exports = NotaryHandler;
