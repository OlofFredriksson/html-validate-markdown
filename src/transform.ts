import {
    type Source,
    type Transformer,
    type TransformContext,
    compatibilityCheck,
} from "html-validate";
import { name, peerDependencies } from "../package.json";
import { parseInfostring } from "./parse-infostring";

const range = peerDependencies["html-validate"];
compatibilityCheck(name, range);

function findLocation(
    source: string,
    index: number,
    preamble: number,
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

function isThenable<T>(value: T | Promise<T>): value is Promise<T> {
    return (
        value &&
        typeof value === "object" &&
        "then" in value &&
        typeof value.then === "function"
    );
}

function noThenableItems(
    value: Array<Iterable<Source> | Promise<Iterable<Source>>>,
): value is Array<Iterable<Source>> {
    return value.every((it) => !isThenable(it));
}

function markdownTransform(
    this: TransformContext,
    source: Source,
): Source[] | Promise<Source[]> {
    const codeFence = /^(```+([^\n]+))([^]*?)^```+/gm;
    const result: Array<Iterable<Source> | Promise<Iterable<Source>>> = [];

    let match;
    while ((match = codeFence.exec(source.data)) !== null) {
        const [, preamble, infostring, data] = match;
        const [line, column] = findLocation(
            source.data,
            match.index,
            preamble.length,
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
            result.push(this.chain(cur, chain));
        }
    }

    if (noThenableItems(result)) {
        return Array.from(result, (it) => Array.from(it)).flat();
    } else {
        return Promise.all(result).then((result) => {
            return Array.from(result, (it) => Array.from(it)).flat();
        });
    }
}

markdownTransform.api = 1;

export default markdownTransform as Transformer;
