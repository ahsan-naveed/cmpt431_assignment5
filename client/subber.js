const protobuf = require("protobufjs");
const zmq = require("zeromq");
const {
  Message,
  ClientEventsSubscribeRequest,
  ClientEventsSubscribeResponse
} = require("sawtooth-sdk/protobuf");

const TP_NAMESPACE = "58504b";
const CLIENT_EVENTS_SUBSCRIBE_REQUEST = 500;
const CLIENT_EVENTS_SUBSCRIBE_RESPONSE = 501;
const CLINET_EVENTS = 504;
const CORRELATION_ID = "123";

// subber.js

protobuf.load("events.proto", (err, root) => {
  if (err) throw Error(err);

  // obtain the message type
  const EventSubscription = root.lookupType("eventspackage.EventSubscription");
  const EventFilter = root.lookupType("eventspackage.EventFilter");
  const EventList = root.lookupType("eventspackage.EventList");

  // subscription payload
  const subscriptionPayload = {
    eventType: "sawtooth/state-delta",
    filters: [
      EventFilter.create({
        key: "address",
        matchString: `${TP_NAMESPACE}.*`,
        filterType: 3
      })
    ]
  };

  // Verify the payload if necessary
  const errMsg = EventSubscription.verify(subscriptionPayload);
  if (errMsg) throw Error(errMsg);

  // construct the subscription
  const sub = EventSubscription.create(subscriptionPayload);

  // submit the Event Subscription
  const sock = zmq.socket("dealer");

  // setup a connection to the validator
  sock.identity = `client${process.pid}`;
  sock.connect("tcp://localhost:4004");

  const request = ClientEventsSubscribeRequest.create({
    subscriptions: [sub]
  });

  // construct the message Wrapper
  const msg = Message.create({
    messageType: CLIENT_EVENTS_SUBSCRIBE_REQUEST,
    correlationId: CORRELATION_ID,
    content: ClientEventsSubscribeRequest.encode(request).finish()
  });

  // console.log(`msg: ${msg}`);
  // console.log(`request: ${request}`);
  // console.log(Buffer.from(JSON.stringify([msg])));

  // send the request
  sock.send([Message.encode(msg).finish()]);

  // recv response
  sock.on("message", message => {
    // parse the message wrapper
    const msg = Message.decode(message);

    console.log(msg);

    // validate the response type
    if (message.messageType == CLIENT_EVENTS_SUBSCRIBE_RESPONSE) {
      // create ClientEventsSubscribeResponse
    } else if (msg.messageType != CLINET_EVENTS) {
      console.log("unexpected message type");
    } else {
      // parse the response
      const events = EventList.decode(msg.content);
      console.log(events);
    }
  });
});
