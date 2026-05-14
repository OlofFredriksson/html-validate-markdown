import defaultConfig from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";

export default [
    {
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/public/**",
            "**/temp/**",
            "**/typedoc/**",
            "**/fixtures/**",
        ],
    },

    ...defaultConfig,
    typescriptConfig(),
    cliConfig(),
    jestConfig(),

    {
        name: "Technical debt",
        rules: {
            "unicorn/filename-case": "off",
        },
    },
];
