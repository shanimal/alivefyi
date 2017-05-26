'use strict';
const RTM = require('satori-sdk-js');
class Channel {

  constructor(cfg) {
    this.queue = [];
    this.ready = false;
    Object.assign(this, cfg);

    const {endpoint, appkey, role, roleSecretKey, channel} = cfg;
    this.listeners = [];
    this.rtm = new RTM(endpoint, appkey, {
      authProvider: RTM.roleSecretAuthProvider(role, roleSecretKey)
    });
    this.rtm.on('enter-connected', () => {
      console.log('Connected to RTM. Powered by Satori SDK...');
      this.ready = true;
      this.check();
    });
    this.rtm.on("leave-connected", function() {
      console.log("Disconnected from RTM.");
    });
    /* set callback for PDU with specific action */
    this.subscription = this.rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
    this.subscription.on('rtm/subscription/data', (pdu) => {
      pdu.body.messages.forEach((msg) => {
        console.log('MSG', msg);
        this.listeners.forEach(l => l(msg));
      });
    });
    /* set callback for all subscription PDUs */
    // this.rtm.on('data', function (pdu) {
    //   console.log('rtm data', pdu);
    //   if (pdu.action.endsWith('/error')) {
    //     console.log('Subscription is failed: ', pdu.body);
    //   }
    // });
    this.rtm.start();

    // todo: onerror this.ready=false
    this.publish = this.publish.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.check = this.check.bind(this);
  }
  check() {
    if (this.queue.length && this.ready) {
      this.rtm.publish(this.channel, this.queue.shift(), this.check);
    }
  }
  publish(data) {
    this.queue.push(data);
    this.check();
  }
  subscribe(callback) {
    const index = this.listeners.indexOf(callback);
    if (!~index) {
      this.listeners.push(callback);
    }
  }
  unsubscribe(callback) {
    const index = this.listeners.indexOf(callback);
    if (~index) {
      this.listeners.splice(index, 1);
    }
    return ~index;
  }
}
class FeedbackLoop {
  constructor(cfg) {
    if (cfg.listen !== undefined && parseInt(cfg.listen) === Math.abs(cfg.listen) ) {
      server(cfg.listen);
    }
    const { endpoint, appkey, role, roleSecretKey } = cfg;
    this.output = new Channel({ endpoint, appkey, role, roleSecretKey, channel: cfg.output });
    this.input = new Channel({ endpoint, appkey, role, roleSecretKey, channel: cfg.input });
    this.ask = this.ask.bind(this);
    this.listen = this.listen.bind(this);
    this.unlisten = this.unlisten.bind(this);
    this.publish = this.publish.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  // users: ask, listen and unlisten
  ask(data) {
    this.input.publish(data);
  }
  listen(callback) {
    this.output.subscribe(callback);
  }
  unlisten(callback) {
    this.output.unsubscribe(callback);
  }

  // providers: publish, subscribe and unsubscribe,
  // just remember, providers can be users too!
  publish(data) {
    this.output.publish(data);
  }
  subscribe(callback) {
    this.input.subscribe(callback);
  }
  unsubscribe(callback) {
    this.input.unsubscribe(callback);
  }
}
function server(port = 0, handler=defaultHandler) {
  const http = require('http');
  http.createServer(handler)
    .listen(port, (err) => {
      return err ? console.log('something bad happened', err) : console.log(`server is listening on ${port}`);
    });
}
function defaultHandler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
}
/**
 * Exports:
 * 1. Provider class so you can make more providers if you need them (Satori SDK doesn't seem to handle more than a handful)
 * 2. An instance of provider with its publish, subscribe and unsubscribe functions
 * @type {{Provider: Provider, publish: Provider.publish, subscribe: Provider.subscribe, unsubscribe: Provider.unsubscribe}}
 */
/*
 * override search channel defaults (change the out channel for instance to
 * offer monthly subscription to premium results and push that channel id each
 * month to paid users or access a private channel)
 */

// todo: think through the publish model. Can we use BOTS on an open-data channel?

const DEFAULT_CONFIG = {
  input:'search-i',
  output:'search-o',
  // todo: should this be an open-data channel?
  appkey: 'ecff36cdd85309C0bCc7da30ebcB9226',
  endpoint: 'wss://s55smyuu.api.satori.com',
  // todo: do we need roles? should be public w/o credentials
  roleSecretKey: '69aB3Ff3cdaC0c5ED8e4Bd72Ed88e88E',
  role: 'search-all',
  // todo: filter satori channels so users and providers can just subscribe to what they want
  filter: '',
  // todo: turn listen into a configurable object to pass to http
  listen: 0
};
const provider = new FeedbackLoop(DEFAULT_CONFIG);
const publish = provider.publish;
const subscribe = provider.subscribe;
const unsubscribe = provider.unsubscribe;
const ask = provider.ask;
const listen = provider.listen;
const unlisten = provider.unlisten;
module.exports = { ask, listen, unlisten, publish, subscribe, unsubscribe };
