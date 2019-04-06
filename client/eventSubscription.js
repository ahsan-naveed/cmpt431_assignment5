const zmq = require("zeromq");
const protobuf = require("sawtooth-sdk/protobuf");

const {
  Message,
  Event,
  EventList,
  EventFilter,
  EventSubscription,
  ClientEventsSubscribeRequest,
  ClientEventsSubscribeResponse
} = protobuf;

const CLIENT_EVENTS_SUBSCRIBE_REQUEST = 500;
const CLIENT_EVENTS_SUBSCRIBE_RESPONSE = 501;
const CLIENT_EVENTS = 504;

const TP_NAMESPACE = "58504b";
const CORRELATION_ID = "58504b";

// subscription payload
const subscriptionPayload = {
  eventType: "sawtooth/state-delta",
  filters: [
    EventFilter.create({
      key: "address",
      matchString: `${TP_NAMESPACE}.*`,
      filterType: EventFilter.FilterType.REGEX_ANY
    })
  ]
};

// Verify the payload if necessary
const errMsg = EventSubscription.verify(subscriptionPayload);
if (errMsg) throw Error(errMsg);

// construct the subscription
const sub = EventSubscription.create(subscriptionPayload);

const request = ClientEventsSubscribeRequest.create({
  subscriptions: [sub]
});

// construct the message Wrapper
const msg = Message.create({
  messageType: CLIENT_EVENTS_SUBSCRIBE_REQUEST,
  correlationId: CORRELATION_ID,
  content: ClientEventsSubscribeRequest.encode(request).finish()
});

// submit the Event Subscription
const sock = zmq.socket("dealer");

// setup a connection to the validator
sock.identity = `client${process.pid}`;
sock.connect("tcp://localhost:4004");

// send the request
sock.send([Message.encode(msg).finish()]);

// recv response
sock.on("message", message => {
  // parse the message wrapper
  const msg = Message.decode(message);

  // validate the response type
  if (msg.messageType == CLIENT_EVENTS_SUBSCRIBE_RESPONSE) {
    const response = ClientEventsSubscribeResponse.decode(msg.content);
    if (response.status == ClientEventsSubscribeResponse.Status.OK) {
      console.log(`Subscription succeeded: ${response.status}`);
    } else {
      console.log(`Subscription failed: ${response.responseMessage}`);
    }
  } else if (msg.messageType != CLIENT_EVENTS) {
    console.log("unexpected message type");
  } else {
    // parse the response
    const eventList = EventList.decode(msg.content);
    eventList.events.forEach(event => {
      console.log(Event.decode(event.data));
    });
  }
});
