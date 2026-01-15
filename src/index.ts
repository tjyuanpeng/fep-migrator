#!/usr/bin/env node

import process from 'node:process'
import { cac } from 'cac'
import findFontFamily from './find-font-family'
import findMessageBox from './find-message-box'
import replaceFep from './replace-fep'
import runInstall from './run-install'

const cli = cac('fep-migrator')
cli.option('-e, --exclude <dir>', '排除目录', { default: [], type: [String] })
  .option('-p, --pkg-manager', '指定包管理工具，可选值：pnpm、npm、yarn', { default: 'pnpm' })
  .option('-d, --dry-run', '模拟运行，不实际修改文件', { default: false })
cli.version(process.env.npm_package_version ?? '-.-.-')
cli.help()

const run = async () => {
  const { options } = cli.parse() as unknown as { options: Options }
  options.root = process.cwd()
  await runInstall(options)
  await replaceFep(options)
  await findFontFamily(options)
  await findMessageBox(options)
}
run()
