// Cleanup
import { rmdir } from "node:fs/promises";
await rmdir("dist/npm", { recursive: true }).catch(() => {});

// Build Declaration File
const tsc = Bun.spawn(["tsc", "-p", "tsconfig.build.json"], {
  stdout: "inherit",
});
await tsc.exited;
if (tsc.exitCode != null && tsc.exitCode > 0) process.exit(tsc.exitCode);

// Build JS
await Bun.build({
  entrypoints: ["src/index.ts", "src/cli.ts"],
  outdir: "dist/npm",
  target: "node",
  splitting: true,
});

console.log("\x1b[1m\x1b[32m✔\x1b[0m Build \x1b[36mdist/npm\x1b[0m");
