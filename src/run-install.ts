import fs from 'node:fs'
import path from 'node:path'
import command from './utils/run-command'

const main = async (options: Options) => {
  const pkgPath = path.resolve(options.root, './package.json')
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`❌ 未找到 \'package.json\'，请在项目根目录执行`)
  }

  await command(options.pkgManager, [
    'add',
    '@falconix/fep',
    '@falconix/icons-vue',
  ], options)
  await command(options.pkgManager, [
    'add',
    '@falconix/fep-resolver',
    '-D',
  ], options)
  await command(options.pkgManager, [
    'remove',
    'element-plus',
    '@element-plus/icons-vue',
  ], options)
}

export default main
