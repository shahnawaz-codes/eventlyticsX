import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tracker: "src/tracker.ts",
  },
  format: ["esm", "cjs", "iife"],
  globalName: "Eventlytics",
  dts: true, // generates type definition files (index.d.ts)
  sourcemap: true,
  clean: true,
});

