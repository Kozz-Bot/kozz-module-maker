# Kozz Handler Maker

This is a library that allows you to create your Handlers for any given chatbot created with Kozz-Bot.

## Authentication

All the entities connected to the Gateway must introduce themselves. Is at this point that the authenticaton happens using a pair of RSA keys. You can generate a pair running the script inside `./scripts/generate_key_pair.sh`. There will be a private key and a public key. The public key must be sent to the person who is running the `Kozz-Gateway` instance to be copied to the `./keys` folder. The name of the files must not be changed. After that, the authentication should be taken care. At the moment you have to authenticate all the entities with the same key pair but it's going to change in the future.

If for some reason you need to generate the introduction payloads outside the library, you can run the scripts `./scripts/boundary_signature.js` or `./scripts/handler_signature.js`. The payload will be outputed to the console and you have to store the signature in a secure place. Currently it's the solution for you to authenticate when in a Web Browser because the readding of the key is done using `fs` which is not supported on browsers.

```bash
node ./scripts/handler_signature.js my-handler
#                                       ^
#                                    Name of the handler
{
  methods: [],
  name: 'my-handler',
  role: 'handler',
  signature: 'EkeHbGsdky3r1AbXBkxnybipTtAdLhJ9sIV0w6BfN7tXpWWHztII7xvyROk0jAVdj3DjzQgWxRugxb2f5qAowcKLmr8akBCVU2PO5hnA/XaXjqX6XR2D+AOwVOYwJZk4ToiiJJ/s/qyouJ643cabm+sAt0VvYHsn2JUcg7YqZY4aexFfjHdWJMGFy8CV+JGtA9YTQvTa0+KZTgxE2qY+aLAmTQ3cXC7TML0EtNUgFJV9jlvWUg0Vm7x47unIyIZWROUm6LP8DPnVkraOFNICwWXqhJJ7FhdxiE88L/Q1s8i9T6deRF5tKiZYduOIXz7wQbB3xyrfAxei7s5vvVsIIA=='
}
```

```bash
node ./scripts/boundary_signature.js my-boundary
#                                       ^
#                                    Name of the boundary
{
  OS: 'windows',
  platforrm: 'WA',
  id: 'my-boundary',
  role: 'boundary',
  signature: 'ONidVqD49w6d7jitqBHtMJ5sJoTqoq1iDNZBruA+xCYLWv5IunY7MF0UwORPJK2pDb4bMlwW+yTd8UdFLlDBzXSEATY+CRUc3HJTS3Hwvf1mICmLqKykERb70I5v1Tba/htakTgKYpTBk1PSBfwabUcLQfNecMZoBoN7J5iCFATshBMeQXgh1mFV9PpS8eNVHnSFDu+d471va9C/BEFutQE+ezLXol/1wtxQm4wKO2a4z07ipUgCPwHaau5dyPPJYr5LDLFGrzzdYenOI5qLthF4Z3t6fswgfwYS5b/yg3tsXr1qgk6YY4Vn5ESjB1Jcits9qsvKz3ryL403nZ4wJg=='
}
```

## Basic Controller

The basic controller is a type of Handler that doens't receive messages. It's purpose is to send events to the boundaries or exchange resources with other entities.

```typescript
const basicController = createBasicController({
	address: 'gateway_address',
	name: 'myController', //must be unique
});

basicController.sendMessage('contact_id', 'boundary_id', 'Hello!!');

basicController.ask
	.handler('otherhandler', {
		resource: 'some_resource',
		data: {},
	})
	.then(resource => {
		basicController.sendMessage.withMedia(
			'contact_id',
			'boundary_id',
			'Here is your picture',
			resource.response
		);
	});
```

## Message Proxy

Message proxy is a type of Handler that will request all the messages from a given boundary to be forwareded to it. The proxy can also request only a single chat from the boundary to be proxied to it. The destination of the messages can be overritten, so there can be a proxy request for another entity other than the proxy itself.

```typescript
const proxy = createProxyInstance({
	address: 'gateway_address',
	source: 'source_boundary_id/chat_id',
	name: 'my_proxy'
	onMessage: message => {
        if (message.body === "Hello"){
            message.reply("World!");
        }

        // Stops listening to messages;
        proxy.revoke();
    },
});

const forwarder = createProxyInstance({
	address: 'gateway_address',
	source: 'source_boundary_id/*',
    //Forwards all the messages to another boundary
	name: 'my_other_boundary'
    // Not dealing with messages here, just forwarding them
	onMessage: message => {},
});
```

## Command Handler

The command handler is a cool CLI-ish command interpreter that can deal with strong-typed commands.

The structure of a command is described below:

### `/hanlder method immediateArg --argName1 arg_value1 --argName2 arg_value2...`

`/` is the initial character. All the commands must start with one of the initial characters.

`handler` is the name of the handler that must reply to the provided command.

`method` is tha name of the method that the command is trying to execute. If no method is provided, it falls back to the method named "default";

`immediateArg` is the argument that follows the method.

`namedArgs` are arguments to the command that can be referencied with a name.

```typescript
createHandlerInstance({
    // only commands comming from those bounaries will attempt to run the methods
	boundariesToHandle: ['my_boundary', 'my-other-boundary'],
	name: 'ping',
	address: 'gateway_address',
	methods: {
        // `/ping` => `pong! 0,3 seconds`
		...createMethod({
            name: 'default',
            args: {},
            func: requester => {
                const now = new Date().getTime();
                const requestTime = requester.rawCommand.message.timestamp;
                const difference = (now - requestTime) / 1000;

                requester.reply(`Pong! ${difference} seconds`);
            },
        });

        // `/ping echo test --foo true --bar 12345` => `you provided the correct args!`
        // `/ping echo test --bar 12345` => `you provided the correct args!`
        // `/ping echo --foo true --bar 12345` => _no_response_
        ...createMethod({
            name: 'echo',
            args: {
                immediate: "string"
                foo: "boolean?",
                bar: "number",
            },
            // the args will be type checked and strong typed in the callback;
            func: (requester, {immediate, foo, bar, baz}) => {
                requester.reply("you provided the correct args!");
            },
        });
	},
});
```

## From template

You cand send or reply to messages using templates. Instead of relying on strings hard-coded in the methods or callbacks, you can create a simpler version of .MD files and read message templates direct from them. It is still in its early stages so you can bet the .md parser will fail. Use at your own risk.

```markdown
> @pong

# PONG!

Time: {{difference}} seconds

> ---
```

```typescript
createHandlerInstance({
    boundariesToHandle: ['my_boundary', 'my-other-boundary'],
	name: 'ping',
	address: 'gateway_address',
	methods: {
        // `/ping` =>
        // `PONG! (in bold)
        // Time: 0.3 seconds` (interpolation with values is working)
		...createMethod({
            name: 'default',
            args: {},
            func: requester => {
                const now = new Date().getTime();
                const requestTime = requester.rawCommand.message.timestamp;
                const difference = (now - requestTime) / 1000;

                requester.reply.withTemplate('pong', {
			        difference,
		        });
            },
        });
    templatePath: './src/Handlers/Ping/reply.kozz.md',
});
```
