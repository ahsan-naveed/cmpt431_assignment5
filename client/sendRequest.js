const { createContext, CryptoFactory } = require("sawtooth-sdk/signing");
const { createHash } = require("crypto");
const cbor = require("cbor");
const { protobuf } = require("sawtooth-sdk");
const request = require("request");

const context = createContext("secp256k1");
const privateKey = context.newRandomPrivateKey();
const signer = new CryptoFactory(context).newSigner(privateKey);

const TP_NAMESPACE = "58504b";
const SIGNER_PUB_KEY = signer.getPublicKey().asHex();

function sendRequest(payload) {
  const payloadBytes = cbor.encode(payload);
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: "notary",
    familyVersion: "1.0",
    inputs: [TP_NAMESPACE],
    outputs: [TP_NAMESPACE],
    signerPublicKey: SIGNER_PUB_KEY,
    batcherPublicKey: SIGNER_PUB_KEY,
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
    signerPublicKey: SIGNER_PUB_KEY,
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
