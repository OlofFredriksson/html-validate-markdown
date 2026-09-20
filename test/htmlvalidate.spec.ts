import path from "node:path";
import { normalizeReport } from "@html-validate/plugin-utils/test-utils";
import { expect, it } from "@jest/globals";
import {
    HtmlValidate,
    StaticConfigLoader,
    staticResolver,
    version,
} from "html-validate";
import Transformer from "../src/transform";

const rootDir = path.resolve(__dirname, "..");

const config = {
    extends: ["html-validate:recommended"],
    transform: {
        "\\.(md)$": "html-validate-markdown",
    },
};

const resolver = staticResolver({
    transformers: {
        "html-validate-markdown": Transformer,
    },
});
const loader = new StaticConfigLoader([resolver], config);

it('should find errors in "markdown.md"', async () => {
    expect.assertions(2);
    const htmlvalidate = new HtmlValidate(loader);
    const report = await htmlvalidate.validateFile("test/markdown.md");
    const normalized = normalizeReport(report, { rootDir, version });
    expect(normalized.valid).toBeTruthy();
    expect(normalized.results).toMatchSnapshot();
});

it('should find errors in "multiline-invalid.md"', async () => {
    expect.assertions(2);
    const htmlvalidate = new HtmlValidate(loader);
    const report = await htmlvalidate.validateFile("test/multiline-invalid.md");
    const normalized = normalizeReport(report, { rootDir, version });
    expect(normalized.valid).toBeFalsy();
    expect(normalized.results).toMatchSnapshot();
});
