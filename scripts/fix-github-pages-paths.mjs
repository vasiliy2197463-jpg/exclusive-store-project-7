import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const prefix = "/exclusive-store-project-7";
const textExtensions = new Set([".html", ".css", ".js", ".json", ".txt", ".xml"]);

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name))) continue;

    const original = await readFile(path, "utf8");
    const extension = extname(entry.name);
    // Next/Image already applies basePath in browser bundles. Rewriting the
    // same strings inside JavaScript produces /basePath/basePath/images/... .
    const updated = extension === ".js"
      ? original
      : original
          .replaceAll('"/images/', `"${prefix}/images/`)
          .replaceAll("'/images/", `'${prefix}/images/`)
          .replaceAll("url(/images/", `url(${prefix}/images/`)
          .replaceAll('"/icons/', `"${prefix}/icons/`)
          .replaceAll("'/icons/", `'${prefix}/icons/`)
          .replaceAll("url(/icons/", `url(${prefix}/icons/`)
          .replaceAll('"/google-play.webp', `"${prefix}/google-play.webp`)
          .replaceAll("'/google-play.webp", `'${prefix}/google-play.webp`);

    if (updated !== original) await writeFile(path, updated);
  }
}

await visit(root);
