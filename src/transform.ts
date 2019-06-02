import { Source } from "html-validate";
import * as fs from "fs";

function findLocation(
	source: string,
	index: number,
	preamble: number
): [number, number] {
	let line = 1;
	let prev = 0;
	let pos = source.indexOf("\n");
	while (pos !== -1) {
		if (pos > index) {
			return [line, index - prev + preamble + 1];
		}
		line++;
		prev = pos;
		pos = source.indexOf("\n", pos + 1);
	}
	return [line, 1];
}

function trimTemplate(str: string): string {
	return str.trim();
}

function* findTemplates(filename: string): Iterable<Source> {
	const source = fs.readFileSync(filename, "utf-8");
	const htmlBlock = /^(```html)([^]*?)^```/gm;
	let match;
	while ((match = htmlBlock.exec(source)) !== null) {
		const [, preamble, data] = match;
		const [line, column] = findLocation(source, match.index, preamble.length);
		yield { data: trimTemplate(data), filename, line, column };
	}
}

function markdownTransform(filename: string): Source[] {
	return Array.from(findTemplates(filename));
}

export default markdownTransform;
