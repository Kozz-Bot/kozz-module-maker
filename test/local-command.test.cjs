const { test } = require('node:test');
const assert = require('node:assert/strict');
const { onCommand } = require('../dist/Socket/Events/Handle/Command');

test('local invocation shares validation, boundary filtering and middleware with gateway commands', async () => {
 const listeners = new Map(), sent = []; let runs = 0;
 const socket = { on: (name, callback) => listeners.set(name, callback), emit: (...args) => sent.push(args) };
 const middleware = [];
 const invoke = onCommand(socket, { set: { args: { count: 'number' }, func: async (r, args) => { await Promise.resolve(); runs++; assert.equal(args.count, 2); assert.equal(r.rawCommand.module, 'test'); } } }, middleware, 'test', '', ['kozz-zapo']);
 const command = { module: 'test', method: 'set', namedArgs: { count: 2 }, message: { id: 'id', boundaryId: 'id', to: '123@g.us' }, boundaryId: 'id', boundaryName: 'kozz-zapo' };
 assert.equal((await invoke(command)).executed, true); assert.equal(runs, 1);
 await invoke({ ...command, boundaryName: 'ai-test-zapo' }); assert.equal(runs, 1);
 await invoke({ ...command, namedArgs: { count: '2' } }); assert.equal(runs, 1);
 middleware.push(cmd => ({ ...cmd, namedArgs: { ...cmd.namedArgs, abort: true } }));
 await invoke(command); assert.equal(runs, 1);
 assert.equal(typeof listeners.get('command'), 'function');
});
