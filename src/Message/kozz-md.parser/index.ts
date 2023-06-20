import * as A from 'arcsecond';

// _________________
// Utility functions
// -----------------

const anything = A.regex(/^.*/);

const exceptChars = (chars: string) => new RegExp(`^[^${chars}\n]+`);

const betweenStrings = <Ident extends string>(
	stringLeft: string,
	stringRight: string,
	identifier: Ident
) =>
	A.sequenceOf([
		A.str(stringLeft),
		A.regex(exceptChars(stringRight)),
		A.str(stringRight),
	]).map(
		x =>
			({
				style: identifier,
				text: x[1],
			} as const)
	);

type TemplateData = {
	[key: string]: unknown;
};

let injectableData: TemplateData = {};

// _________________
// Parser itself ...
// -----------------
const paragraph = A.sequenceOf([A.str('#'), A.whitespace, anything]).map(
	x =>
		({
			style: 'paragraph',
			text: x[2],
		} as const)
);

const italic = betweenStrings('_', '_', 'italic');
const stroke = betweenStrings('~', '~', 'stroke');
const bold = betweenStrings('**', '**', 'bold');
const boldAndItalic = betweenStrings('**_', '_**', 'boldAndItalic');
const code = betweenStrings('`', '`', 'code');
const template = betweenStrings('{{', '}}', 'template').map(x => ({
	...x,
	text: `${injectableData[x.text]}`,
}));

const normalText = A.regex(exceptChars('`~_*{>')).map(
	x =>
		({
			style: 'normal',
			text: x,
		} as const)
);

const listItem = A.sequenceOf([A.str('-'), A.whitespace, anything]).map(
	x =>
		({
			style: 'listItem',
			text: x[2],
		} as const)
);

const lineBreak = A.str('<br>').map(
	() =>
		({
			style: 'lineBreak',
			text: '',
		} as const)
);

const textLine = A.sequenceOf([
	A.many(A.whitespace),
	A.many1(
		A.choice([
			paragraph,
			stroke,
			listItem,
			boldAndItalic,
			bold,
			italic,
			code,
			template,
			lineBreak,
			normalText,
		])
	),
	A.many(A.str('\n')),
]).map(x => ({
	line: x[1],
}));

const messageDeclaration = A.sequenceOf([
	A.str('>'),
	A.whitespace,
	A.str('@'),
	anything,
]).map(x => x[3]);

const messageEnd = A.sequenceOf([
	A.str('>'),
	A.whitespace,
	A.str('---'),
	A.many(A.str('-')),
	A.many(A.str('\n')),
]);

const message = A.sequenceOf([
	A.many(A.str('\n')),
	messageDeclaration,
	A.many1(textLine),
	A.many(A.str('\n')),
	messageEnd,
]).map(x => ({
	messageName: x[1],
	messageBody: x[2],
}));

const document = A.many(message);

const parseDocument = (documentInString: string, data: TemplateData) => {
	injectableData = data;
	const result = document.run(documentInString);
	if (result.isError) {
		throw result.error;
	} else {
		return result;
	}
};

export default parseDocument;
