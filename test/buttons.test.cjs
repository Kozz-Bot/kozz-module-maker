const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createReply } = require('../dist/Message/RoutineCreation/reply');

test('reply.withButtons retains fallback, actor scope and quote on the existing event', () => {
 const sent = [];
 const reply = createReply({ emit: (...args) => sent.push(args) }, { id: 'request', to: 'group@g.us', from: 'user@lid', boundaryId: 'boundary' });
 const buttons = [{ id: 'ping', label: 'Ping', command: '!ping' }];
 reply.withButtons('Menu', { buttons });
 assert.equal(sent[0][0], 'reply_with_text');
 assert.equal(sent[0][1].body, 'Menu\n\nPing: !ping');
 assert.equal(sent[0][1].quoteId, 'request');
 assert.equal(sent[0][1].interactive.allowedContactId, 'user@lid');
 assert.equal(sent[0][1].boundaryId, 'boundary');
 reply.withButtons('Menu', { buttons, audience: 'chat' });
 assert.equal(sent[1][1].interactive.allowedContactId, undefined);
 assert.deepEqual(buttons, [{ id: 'ping', label: 'Ping', command: '!ping' }]);
});
