export function parseInfostring(
    infostring: string
): { lang: string; params: string[] } {
    const [lang, ...params] = infostring.trim().split(/\s+/);
    return { lang, params };
}
