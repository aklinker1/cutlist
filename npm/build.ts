// Cleanup
import { rmdir } from 'node:fs/promises';
await rmdir('dist', { recursive: true }).catch(() => {});
import pkg from './package.json';

// Build Declaration File
const tsc = Bun.spawn(['tsc', '-p', 'tsconfig.build.json'], {
  stdout: 'inherit',
});
await tsc.exited;
if (tsc.exitCode != null && tsc.exitCode > 0) process.exit(tsc.exitCode);

// Build JS
await Bun.build({
  entrypoints: ['src/index.ts', 'src/onshape.ts'],
  outdir: 'dist',
  target: 'node',
  splitting: true,
  external: Object.keys(pkg.dependencies).concat(
    Object.keys(pkg.devDependencies),
  ),
});

console.log('\x1b[1m\x1b[32m✔\x1b[0m Build \x1b[36mdist\x1b[0m');
