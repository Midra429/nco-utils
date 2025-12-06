import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/**/*.ts',
  format: 'esm',
  target: 'esnext',
  platform: 'browser',
  dts: true,
  outputOptions: {
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
})
