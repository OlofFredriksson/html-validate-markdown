import { parseInfostring } from "./parse-infostring";

it("should return lang and params", () => {
    expect.assertions(1);
    expect(parseInfostring("html startline=3 static")).toEqual({
        lang: "html",
        params: ["startline=3", "static"],
    });
});

it("should handle multiple spaces", () => {
    expect.assertions(1);
    expect(parseInfostring("html  foo  bar")).toEqual({
        lang: "html",
        params: ["foo", "bar"],
    });
});

it("should strip leading and trailing spaces", () => {
    expect.assertions(1);
    expect(parseInfostring(" html foo ")).toEqual({
        lang: "html",
        params: ["foo"],
    });
});
