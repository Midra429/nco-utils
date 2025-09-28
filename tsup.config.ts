import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  target: 'esnext',
  format: ['esm'],
  clean: true,
  dts: true,
})
