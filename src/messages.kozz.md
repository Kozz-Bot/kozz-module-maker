> @foo

# This is the foo message

The foo message says "Hi" to {{name}}

_Nice to meet you!_

> ---

> @bar

# This is the bar message

The foo message says "GoodBye" to {{name}}

_See you soon!_

> ---

> @list

# This is the header. It can't interpolate variables.

# This is a list. The items can't interpolate variables or styles yet.

- item 1
- item 2
- item 3
  <br>

# This is a table:

`| Command       | Bot's Response                   |`
`| ------------- | -------------------------------- |`
`| !ping         | pong!                            |`
`| !ping default | pong!                            |`
`| !ping blah    | Ooops, this method doesn't exist |`
<br>

_Note:_ Be careful not to make wide tables, most chat's will automatically break lines that become too long.
<br>

Text _*bold*_ _italic_ and `monospace` can appear in the same line, but you can't mix and match them
In order to skip a line, use a line with nothing but `"<br>"`
<br>
<br>
<br>

Messages start with `"> @messageName"` and end with `"> ---"`

> ---
