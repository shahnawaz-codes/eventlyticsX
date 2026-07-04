import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // generates type definition files (index.d.ts)
  sourcemap: true,
  clean: true,
});
