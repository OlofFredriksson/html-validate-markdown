import { HtmlValidate } from "html-validate";

const config = {
    extends: ["htmlvalidate:recommended"],
    transform: {
        "\\.(md)$": "<rootDir>",
    },
};

test('should find errors in "markdown.md"', () => {
    const htmlvalidate = new HtmlValidate(config);
    const report = htmlvalidate.validateFile("test/markdown.md");
    expect(report.valid).toBeTruthy();
    expect(report.results).toMatchSnapshot();
});

test('should find errors in "multiline-invalid.md"', () => {
    const htmlvalidate = new HtmlValidate(config);
    const report = htmlvalidate.validateFile("test/multiline-invalid.md");
    expect(report.valid).toBeFalsy();
    expect(report.results).toMatchSnapshot();
});
