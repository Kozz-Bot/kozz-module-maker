import { Command } from 'kozz-types';
import { UseFn } from './Instance';
import fs from 'fs';
import crypto from 'crypto';

const privateKey = fs.readFileSync('./keys/privatekey.pem', {
	encoding: 'utf-8',
});

export const runUse = (useArr: UseFn[], args: Command) => {
	return useArr.reduce((res, fn) => {
		return fn(res);
	}, args);
};

export function normalizeString(string: string) {
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const signPayload = <T extends Record<string, any>>(payload: T) => {
	const signature = crypto.sign(
		'sha256',
		Buffer.from(JSON.stringify(payload, undefined, '  ')),
		{ key: privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }
	);

	return {
		...payload,
		signature,
	};
};
