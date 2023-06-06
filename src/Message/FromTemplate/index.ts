import fs from 'fs/promises';
import parseDocument from '../kozz-md.parser';

export type Line = {
  line: Text[];
};

export type Text = {
  style: keyof typeof styleMap;
  text: string;
};

export const bold = (s: string) => `*${s}*`;
export const italic = (s: string) => `_${s}_`;
export const stroke = (s: string) => `~${s}~`;
export const monospace = (s: string) => `\`\`\`${s}\`\`\``;

const styleMap = {
  bold: bold,
  stroke: stroke,
  italic: italic,
  code: monospace,
  boldAndItalic: (s: string) => bold(italic(s)),
  normal: (s: string) => s,
  template: (s: string) => s,
  paragraph: (s: string) => `${bold(s)}\n`,
  listItem: (s: string) => `  - ${s}`,
  lineBreak: (s: string) => '',
};

type Template = {
  messageName: string;
  messageBody: Line[];
};

export const getTemplates = (path: string) =>
  fs.readFile(path, { encoding: 'utf-8' });

const textMessageFromTemplate = (
  templateName: string,
  documentAsString: string,
  templateData: Record<string, any> = {}
) => {
  const { result } = parseDocument(documentAsString, templateData);

  const myMessage = result.filter(msg => msg.messageName === templateName)[0];

  if (!myMessage) {
    return console.error('No message found for the provided name');
  }

  return myMessage.messageBody.reduce((msg, { line }) => {
    line.forEach(styledText => {
      // I know this type asting is ugly
      const stylingFn = styleMap[styledText.style as keyof typeof styleMap];
      return (msg += stylingFn(styledText.text));
    });
    return (msg += '\n');
  }, '');
};

export const loadTemplates = (path: string) => {
  const getTextFromTemplate = (
    templateName: string,
    templateData: Record<string, any> = {}
  ) => {
    return getTemplates(path).then(templates => {
      return textMessageFromTemplate(templateName, templates, templateData);
    });
  };
  return {
    getTextFromTemplate,
  };
};
