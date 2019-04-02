const { createContext, CryptoFactory } = require("sawtooth-sdk/signing");
const { createHash } = require("crypto");
const cbor = require("cbor");
const { protobuf } = require("sawtooth-sdk");
const request = require("request");

const context = createContext("secp256k1");
const privateKey = context.newRandomPrivateKey();
const signer = new CryptoFactory(context).newSigner(privateKey);

const TP_NAMESPACE = "58504b";

function sendRequest(payload) {
  const payloadBytes = cbor.encode(payload);
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: "notary",
    familyVersion: "1.0",
    inputs: [TP_NAMESPACE],
    outputs: [TP_NAMESPACE],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash("sha512")
      .update(payloadBytes)
      .digest("hex"),
    nonce: new Date().toString()
  }).finish();

  const signature = signer.sign(transactionHeaderBytes);

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
  });

  const transactions = [transaction];

  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map(txn => txn.headerSignature)
  }).finish();

  headerSignature = signer.sign(batchHeaderBytes);

  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: headerSignature,
    transactions: transactions
  });

  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish();

  request.post(
    {
      url: "http://localhost:8008/batches",
      body: batchListBytes,
      headers: { "Content-Type": "application/octet-stream" }
    },
    (err, response) => {
      if (err) return console.log(err);
      console.log(response.body);
    }
  );
}

var args = process.argv;
var payload = JSON.parse(args[2]);
sendRequest(payload);

/**
 * Client applications can subscribe to Hyperledger Sawtooth events using ZMQ and Protobuf messages. The general process is:
 * 1. Construct a subscription that includes the event type and any filters
 * 2. Submit the event subscription as a message to the validator
 * 3. Wait for a response from the validator
 * 4. Start listening for events
 */
