export function parseInfostring(infostring: string): {
	lang: string;
	params: string[];
} {
	const [lang, ...params] = infostring.trim().split(/\s+/);
	/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- technical debt */
	return { lang: lang!, params };
}
