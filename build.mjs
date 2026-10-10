/* This file is managed by "@html-validate/plugin-template". Changes will be overwritten */

import fs from "node:fs/promises";
import { generateDtsBundle } from "dts-bundle-generator";
import { analyzeMetafile, build as esbuild } from "esbuild";

const entrypoint = {
	cjs: "src/entry-cjs.ts",
	esm: "src/entry-esm.ts",
};

const extension = {
	cjs: { js: ".cjs", dts: ".d.cts" },
	esm: { js: ".mjs", dts: ".d.mts" },
};

await fs.rm("dist", { recursive: true, force: true });

for (const format of ["cjs", "esm"]) {
	const result = await esbuild({
		entryPoints: [{ in: entrypoint[format], out: "index" }],
		outdir: `dist/${format}`,
		bundle: true,
		platform: "node",
		format,
		target: "node22",
		logLevel: "info",
		sourcemap: true,
		metafile: true,
		outExtension: {
			".js": extension[format].js,
		},
		external: ["@html-validate/plugin-utils", "html-validate"],
	});

	if (format === "esm") {
		console.log(await analyzeMetafile(result.metafile));
	}

	const dts = generateDtsBundle([{ filePath: entrypoint[format], output: { noBanner: true } }], {
		preferredConfigPath: `tsconfig.${format}.json`,
	});

	await fs.writeFile(`dist/${format}/index${extension[format].dts}`, dts, "utf8");
}
