/* This file is managed by "@html-validate/plugin-template". Changes will be overwritten */

const { defineConfig } = require("html-validate");
const Plugin = require("./dist/cjs/index.cjs");

module.exports = defineConfig({
	plugins: [Plugin],
	extends: ["html-validate:recommended", `${Plugin.name}:recommended`],
	elements: ["html5"],
});
