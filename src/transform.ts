import { Source, Transformer } from "html-validate";

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

function* markdownTransform(source: Source): Iterable<Source> {
    const htmlBlock = /^(```html)([^]*?)^```/gm;

    let match;
    while ((match = htmlBlock.exec(source.data)) !== null) {
        const [, preamble, data] = match;
        const [line, column] = findLocation(
            source.data,
            match.index,
            preamble.length
        );
        yield {
            data,
            filename: source.filename,
            line,
            column,
            originalData: source.originalData || source.data,
        };
    }
}

markdownTransform.api = 1;

export default markdownTransform as Transformer;
