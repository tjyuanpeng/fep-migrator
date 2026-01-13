#!/usr/bin/env node

import process from 'node:process'
import { cac } from 'cac'
import replaceFep from './replace-fep'

const cli = cac('fep-migrator')
cli
  .version(process.env.npm_package_version ?? '-')
  .command('<...dir>', '处理路径')
  .action(async (dirs) => {
    console.log('# 开始处理.')
    const statistic = await replaceFep(dirs)
    console.log(`# 所有文件迁移完成。共处理 ${statistic.total} 个文件，成功 ${statistic.success} 个，失败 ${statistic.fail} 个`)
  })
cli.help()
cli.parse()
