export const createDeleteMessagePayload = (
	boundaryName: string,
	messageId: string,
	local = false
) => {
	return {
		boundaryName,
		messageId,
		localDelete: !!local,
	};
};
