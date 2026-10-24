const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

test('multiple proxies register after introduction and reconnect without duplicating listeners', () => {
 const filename = path.resolve(__dirname, '../dist/Instance/GeneralModule/index.js');
 const localRequire = createRequire(filename);
 const socket = new EventEmitter();
 let connect;
 const subscriptions = [], revocations = [], received = [];
 const module = { exports: {} };
 vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
  module, exports: module.exports, process, console,
  require: name => {
   if (name === '../../Socket') return { connect: callback => { connect = callback; return { socket, registerMethods() {} }; } };
   if (name === '../../Socket/Events/Emit/Introduction') return { introduce() {} };
   if (name === '../../Socket/Events/Emit/RequestProxy') return { ...localRequire(name), requestProxy: (_, payload) => subscriptions.push(payload) };
   if (name === '../../Socket/Events/Emit/RevokeProxy') return { revokeProxy: (_, source, subscriber) => revocations.push({ source, subscriber }) };
   return localRequire(name);
  },
 }, { filename });
 const proxies = [
  { source: 'boundary/100@g.us', subscriber: 'first', onMessage: message => received.push(message.message.chatId) },
  { source: 'boundary/200@g.us', subscriber: 'second', onMessage: message => received.push(message.message.chatId) },
 ];
 const instance = module.exports.createModule({ name: 'multi', address: 'unused', proxy: proxies });
 connect();
 assert.equal(subscriptions.length, 0);
 socket.emit('introduction_ack', { success: true });
 assert.deepEqual(subscriptions.map(item => item.subscriber), ['first', 'second']);
 assert.equal(socket.listenerCount('proxied_message'), 1);
 connect();
 assert.equal(socket.listenerCount('proxied_message'), 1);
 socket.emit('introduction_ack', { success: true });
 assert.equal(subscriptions.length, 4);
 socket.emit('proxied_message', { id: 'test', boundaryName: 'boundary', boundaryId: 'boundary', chatId: '100@g.us', to: '100@g.us', from: 'user@lid' });
 assert.deepEqual(received, ['100@g.us']);
 instance.proxy.revoke();
 assert.deepEqual(revocations, [
  { source: 'boundary/100@g.us', subscriber: 'first' },
  { source: 'boundary/200@g.us', subscriber: 'second' },
 ]);
});
