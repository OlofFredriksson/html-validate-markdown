import fs from "node:fs/promises";
import { build as esbuild, analyzeMetafile } from "esbuild";

const entrypoint = {
    cjs: "src/cjs-shim.ts",
    esm: "src/transform.ts",
};

const extension = {
    cjs: ".cjs",
    esm: ".mjs",
};

await fs.rm("dist", { recursive: true, force: true });

for (const format of ["cjs", "esm"]) {
    const result = await esbuild({
        entryPoints: [{ in: entrypoint[format], out: "index" }],
        outdir: "dist",
        bundle: true,
        platform: "node",
        format,
        target: "node20",
        logLevel: "info",
        metafile: true,
        outExtension: {
            ".js": extension[format],
        },
        external: ["html-validate"],
    });
    if (format === "esm") {
        console.log(await analyzeMetafile(result.metafile));
    }
}
