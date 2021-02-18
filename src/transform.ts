import { Source, Transformer } from "html-validate";
import { TransformContext } from "html-validate/dist/transform";

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
    const codeFence = /^(```([^\s]+))([^]*?)^```/gm;

    let match;
    while ((match = codeFence.exec(source.data)) !== null) {
        const [, preamble, lang, data] = match;
        const [line, column] = findLocation(
            source.data,
            match.index,
            preamble.length
        );
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

export default markdownTransform as Transformer;
