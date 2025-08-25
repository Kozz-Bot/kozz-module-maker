/**
 * Creates an inline command with unespecified name and payload data.
 * @param commandName
 * @param data
 */
export const inlineCommand = (
	commandName: string,
	data: Record<string, any> = {}
) => {
	return `%${commandName}:${JSON.stringify(data)}`;
};

/**
 * Tags someone in the message. The tag will be visible for everyone
 * @param id
 */
export const tagMember = (id: string) => inlineCommand('mention', { id });

/**
 * Tags someone in the message. The tag WILL NOT be visible for anyone
 * @param id
 * @returns
 */
export const invisibleTagMember = (id: string) =>
	inlineCommand('invisiblemention', { id });

/**
 * Invisibly tag everyone
 * @param except
 * @returns
 */
export const tagEveryone = (except: string[] = []) =>
	inlineCommand('tageveryone', {
		except,
	});

/**
 * Formats text as bold.
 * @param text The text to be formatted as bold
 */
export const bold = (text: string) => inlineCommand('bold', { text });

/**
 * Formats text as inline code.
 * @param text The text to be formatted as code
 */
export const code = (text: string) => inlineCommand('code', { text });

/**
 * Formats text as monospace.
 * @param text The text to be formatted as monospace
 */
export const monospace = (text: string) => inlineCommand('monospace', { text });

/**
 * Formats text with stroke effect.
 * @param text The text to be formatted with stroke
 */
export const stroke = (text: string) => inlineCommand('stroke', { text });

/**
 * Formats text as italic.
 * @param text The text to be formatted as italic
 */
export const italic = (text: string) => inlineCommand('italic', { text });

/**
 * Creates a list item.
 * @param text The content of the list item
 */
export const listItem = (text: string) => inlineCommand('listItem', { text });

export const paragraph = (text: string) => inlineCommand('paragraph', { text });
