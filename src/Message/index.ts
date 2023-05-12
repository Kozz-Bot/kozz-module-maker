import { Command } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { replyWithText } from './PayloadCreation';

export type MessageObj = {
	reply: (text: string) => void;
};

export const createMessageObject = (socket: Socket, command: Command) => {
	const reply = (text: string) => {
		socket.emit('reply_with_text', replyWithText(command, text));
	};

	return {
		reply,
	};
};
