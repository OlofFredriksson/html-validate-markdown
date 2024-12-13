import {
    FileSystemConfigLoader,
    HtmlValidate,
    type Report,
} from "html-validate";
import Transformer from "../src/transform";

jest.mock("html-validate-markdown", () => Transformer, { virtual: true });

const config = {
    extends: ["html-validate:recommended"],
    transform: {
        "\\.(md)$": "html-validate-markdown",
    },
};
const loader = new FileSystemConfigLoader(config);

/**
 * Filter out properties not present in all supported versions of html-validate (see
 * peerDependencies). This required in the version matrix integration test.
 */
function filterReport(report: Report): void {
    for (const result of report.results) {
        for (const msg of result.messages) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any --  debt*/
            const src: any = msg;
            delete src.ruleUrl;
            delete src.context;
        }
    }
}

it('should find errors in "markdown.md"', async () => {
    const htmlvalidate = new HtmlValidate(loader);
    const report = await htmlvalidate.validateFile("test/markdown.md");
    filterReport(report);
    expect(report.valid).toBeTruthy();
    expect(report.results).toMatchSnapshot();
});

it('should find errors in "multiline-invalid.md"', async () => {
    const htmlvalidate = new HtmlValidate(loader);
    const report = await htmlvalidate.validateFile("test/multiline-invalid.md");
    filterReport(report);
    expect(report.valid).toBeFalsy();
    expect(report.results).toMatchSnapshot();
});
