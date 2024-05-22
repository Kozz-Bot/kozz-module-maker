/**
 * Creates an inline command with unespecified name and payload data.
 * @param commandName
 * @param data
 */
export const generalCommand = (
	commandName: string,
	data: Record<string, any> = {}
) => {
	return `%${commandName}:${JSON.stringify(data)}`;
};

/**
 * Tags someone in the message. The tag will be visible for everyone
 * @param id
 */
export const tagMember = (id: string) => generalCommand('mention', { id });

/**
 * Tags someone in the message. The tag WILL NOT be visible for anyone
 * @param id
 * @returns
 */
export const invisibleTagMember = (id: string) =>
	generalCommand('invisiblemention', { id });

export const tagEveryone = (except: string[] = []) =>
	generalCommand('tageveryone', {
		except,
	});
