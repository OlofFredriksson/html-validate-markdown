import {
    Source,
    Transformer,
    TransformContext,
    compatibilityCheck,
} from "html-validate";
import { parseInfostring } from "./parse-infostring";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const pkg = require("../package.json");

/* warn when using unsupported html-validate library version */
/* istanbul ignore next */
if (compatibilityCheck) {
    const range = pkg.peerDependencies["html-validate"];
    compatibilityCheck(pkg.name, range);
}

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

function* markdownTransform(
    this: TransformContext,
    source: Source
): Iterable<Source> {
    const codeFence = /^(```+([^\n]+))([^]*?)^```+/gm;

    let match;
    while ((match = codeFence.exec(source.data)) !== null) {
        const [, preamble, infostring, data] = match;
        const [line, column] = findLocation(
            source.data,
            match.index,
            preamble.length
        );

        const { lang, params } = parseInfostring(infostring);
        if (params.includes("novalidate")) {
            continue;
        }

        const cur: Source = {
            data,
            offset: match.index + (source.offset || 0) + preamble.length,
            filename: source.filename,
            line,
            column,
            originalData: source.originalData || source.data,
        };

        /* unless the language is explicitly html the language is tested if it
         * have a configured transformer */
        const chain = `${source.filename}:${lang}`;
        if (lang === "html" || this.hasChain(chain)) {
            yield* this.chain(cur, chain);
        }
    }
}

markdownTransform.api = 1;

export = markdownTransform as Transformer;
