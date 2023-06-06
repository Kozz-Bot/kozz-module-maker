import { Command } from 'kozz-types';
import { UseFn } from '../Instance/Handler';
import fs from 'fs';
import crypto from 'crypto';

let privateKey: string | undefined;

export const runUse = (useArr: UseFn[], args: Command) => {
	return useArr.reduce((res, fn) => {
		return fn(res);
	}, args);
};

export function normalizeString(string: string) {
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const signPayload = <T extends Record<string, any>>(
	payload: T,
	signature?: string
) => {
	if (signature) {
		return {
			...payload,
			signature,
		};
	}
	try {
		return signInNodeEnvironment(payload);
	} catch (e) {
		throw 'Please generate a keypair using the script "scripts/generate_key_pair.sh" and copy the publickey to the  "${projetc_root}/keys/privatekey.pem". Leve the key names as it is';
	}
};

export const signInBrowser = <T extends Record<string, any>>(payload: T) => {
	try {
		// @ts-ignore
		return fetch('./keys/privatekey.pem')
			.then((privateKey: any) => privateKey.text())
			.then((privateKey: string) => {
				const signature = crypto.sign(
					'sha256',
					Buffer.from(JSON.stringify(payload, undefined, '  ')),
					{ key: privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }
				);

				return {
					...payload,
					signature,
				};
			});
	} catch (e) {
		throw 'Please generate a keypair using the script "scripts/generate_key_pair.sh" and copy the publickey to the  "${projetc_root}/keys/privatekey.pem". Leve the key names as it is';
	}
};

export const signInNodeEnvironment = <T extends Record<string, any>>(
	payload: T
) => {
	try {
		privateKey = fs.readFileSync('./keys/privatekey.pem', {
			encoding: 'utf-8',
		});
	} catch (e) {
		throw 'Please generate a keypair using the script "scripts/generate_key_pair.sh" and copy the publickey to the  "${project_root}/keys/privatekey.pem". Leve the key names as it is';
	}

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
