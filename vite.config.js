import autoImport from "unplugin-auto-import";
import { purgePolyfills } from "unplugin-purge-polyfills";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    autoImport.vite({
      imports: [
        {
          from: "ts-pattern",
          imports: ["match", "P"],
        },
        {
          from: "es-toolkit/array",
          imports: [
            "at",
            "chunk",
            "compact",
            "countBy",
            "difference",
            "differenceBy",
            "differenceWith",
            "drop",
            "dropRight",
            "dropRightWhile",
            "dropWhile",
            "fill",
            "flatMap",
            "flatMapDeep",
            "flatten",
            "flattenDeep",
            "groupBy",
            "head",
            "initial",
            "intersection",
            "intersectionBy",
            "intersectionWith",
            "isSubset",
            "isSubsetWith",
            "keyBy",
            "last",
            "maxBy",
            "minBy",
            "orderBy",
            "partition",
            "pull",
            "pullAt",
            "remove",
            "sample",
            "sampleSize",
            "shuffle",
            "sortBy",
            "tail",
            "take",
            "takeRight",
            "takeRightWhile",
            "takeWhile",
            "toFilled",
            "union",
            "unionBy",
            "unionWith",
            "uniq",
            "uniqBy",
            "uniqWith",
            "unzip",
            "unzipWith",
            "windowed",
            "without",
            "xor",
            "xorBy",
            "xorWith",
            "zip",
            "zipObject",
            "zipWith",
          ],
        },
        {
          from: "es-toolkit/function",
          imports: [
            "flow",
            "flowRight",
            "partial",
            "partialRight",
            "rest",
            "spread",
          ],
        },
        {
          from: "es-toolkit/object",
          imports: [
            "clone",
            "cloneDeep",
            "cloneDeepWith",
            "findKey",
            "flattenObject",
            "invert",
            "mapKeys",
            "mapValues",
            "merge",
            "mergeWith",
            "omit",
            "omitBy",
            "pick",
            "pickBy",
            "toCamelCaseKeys",
            "toMerged",
            "toSnakeCaseKeys",
          ],
        },
      ],
    }),
    tailwindcss(),
    sveltekit(),
    purgePolyfills.vite({}),
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,

  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
