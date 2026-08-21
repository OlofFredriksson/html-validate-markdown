import { expect, it, jest } from "@jest/globals";
import { type Source } from "html-validate";
import { transformFile, transformString } from "html-validate/test-utils";

import transform from "./transform";

it("should extract html blocks from markdown files", async () => {
    expect.assertions(9);
    const result = await transformFile(transform, "./test/markdown.md");
    expect(result).toHaveLength(2);

    expect(result[0].data).toMatchSnapshot();
    expect(result[0].filename).toBe("./test/markdown.md");
    expect(result[0].line).toBe(3);
    expect(result[0].column).toBe(9);

    expect(result[1].data).toMatchSnapshot();
    expect(result[1].filename).toBe("./test/markdown.md");
    expect(result[1].line).toBe(9);
    expect(result[1].column).toBe(9);
});

it("should extract html blocks from markdown files with multi line html", async () => {
    expect.assertions(1);
    const result = await transformFile(transform, "./test/multiline.md");
    expect(result).toHaveLength(1);
});

it("should handle multiple backticks", async () => {
    expect.assertions(2);
    const markdown = "````html\n<p></p>\n````";
    const result = await transformString(transform, markdown);
    expect(result).toHaveLength(1);
    expect(result[0].data.trim()).toBe("<p></p>");
});

it("should handle leading space", async () => {
    expect.assertions(2);
    const markdown = "``` html\n<p></p>\n```";
    const result = await transformString(transform, markdown);
    expect(result).toHaveLength(1);
    expect(result[0].data.trim()).toBe("<p></p>");
});

it("should ignore code fence when novalidate is used", async () => {
    expect.assertions(1);
    const markdown = "```html novalidate\n<p></p>\n```";
    const result = await transformString(transform, markdown);
    expect(result).toHaveLength(0);
});

it("should chain transformations", async () => {
    expect.assertions(1);
    const chain = jest.fn((source: Source, _filename: string) => [source]);
    await transformFile(transform, "./test/chain.md", chain);
    expect(chain).toHaveBeenCalledWith(
        expect.anything(),
        "./test/chain.md:vue",
    );
});
