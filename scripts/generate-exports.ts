import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'

const OUTPUT_DIR = 'dist'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = require(packageJsonPath)

const outDir = path.resolve(__dirname, `../${OUTPUT_DIR}`)
const files = globSync(path.join(outDir, '/**/*.js'))

packageJson.exports = {}

files.forEach((file) => {
  const dirSplited = path.relative(outDir, file).split('/')
  const fileName = path.basename(dirSplited.pop()!, '.js')

  if (/^chunk-[A-Z0-9]{8}$/.test(fileName)) return

  let alias: string
  let importPath: string
  let typesPath: string

  if (!dirSplited.length) {
    alias = fileName === 'index' ? '.' : `./${fileName}`
    importPath = `${fileName}.js`
    typesPath = `${fileName}.d.ts`
  } else if (fileName === 'index') {
    const basePath = dirSplited.join('/')

    alias = `./${basePath}`
    importPath = `${basePath}/index.js`
    typesPath = `${basePath}/index.d.ts`
  } else {
    const rootDir = dirSplited[0]

    alias = `./${rootDir}/*`
    importPath = `${rootDir}/*.js`
    typesPath = `${rootDir}/*.d.ts`
  }

  importPath = `./${OUTPUT_DIR}/${importPath}`
  typesPath = `./${OUTPUT_DIR}/${typesPath}`

  if (alias === '.') {
    packageJson.module = importPath
    packageJson.types = typesPath
  }

  packageJson.exports[alias] = {
    import: importPath,
    types: typesPath,
  }
})

packageJson.exports = Object.fromEntries(
  Object.entries(packageJson.exports).sort(([a], [b]) => a.localeCompare(b))
)

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
