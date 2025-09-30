import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'

const outDirName = 'dist'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = require(packageJsonPath)

const outDir = path.resolve(__dirname, `../${outDirName}`)
const files = globSync(path.join(outDir, '/**/*.js'))

packageJson.exports = {}

files.forEach((file) => {
  const dirSplited = path.relative(outDir, file).split('/')
  const fileName = path.basename(dirSplited.pop()!, '.js')

  if (/^chunk-[A-Z0-9]{8}$/.test(fileName)) return

  const basePath = dirSplited.join('/')

  let alias: string
  let importPath: string
  let typesPath: string

  if (!dirSplited.length) {
    alias = fileName === 'index' ? '.' : `./${fileName}`
    importPath = `${fileName}.js`
    typesPath = `${fileName}.d.ts`
  } else if (fileName === 'index') {
    alias = `./${basePath}`
    importPath = `${basePath}/index.js`
    typesPath = `${basePath}/index.d.ts`
  } else {
    alias = `./${basePath}/*`
    importPath = `${basePath}/*.js`
    typesPath = `${basePath}/*.d.ts`
  }

  importPath = `./${outDirName}/${importPath}`
  typesPath = `./${outDirName}/${typesPath}`

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
