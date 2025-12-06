import path from 'node:path'

import { chunkDir, outDir } from '../tsdown.config'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJsonFile = Bun.file(packageJsonPath)
const packageJson = await packageJsonFile.json()

const outDirPath = path.resolve(__dirname, `../${outDir}`)
const glob = new Bun.Glob(path.join(outDirPath, '/**/*.js'))

packageJson.exports = {}

for await (const file of glob.scan()) {
  const dirSplited = path.relative(outDirPath, file).split('/')
  const fileName = path.basename(dirSplited.pop()!, '.js')

  if (dirSplited[0] === chunkDir) continue

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

  importPath = `./${outDir}/${importPath}`
  typesPath = `./${outDir}/${typesPath}`

  if (alias === '.') {
    packageJson.module = importPath
    packageJson.types = typesPath
  }

  packageJson.exports[alias] = {
    import: importPath,
    types: typesPath,
  }
}

packageJson.exports = Object.fromEntries(
  Object.entries(packageJson.exports).sort(([a], [b]) => a.localeCompare(b))
)

await packageJsonFile.write(JSON.stringify(packageJson, null, 2) + '\n')

await Bun.$`biome format --write ${packageJsonPath}`.quiet()
