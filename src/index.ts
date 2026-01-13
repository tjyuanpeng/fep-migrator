#!/usr/bin/env node

import process from 'node:process'
import { cac } from 'cac'
import replaceFep from './replace-fep'

const cli = cac('fep-migrator')
cli
  .version(process.env.npm_package_version ?? '-')
  .command('<...dir>', '处理路径')
  .action(async (dirs) => {
    replaceFep(dirs)
  })
cli.help()
cli.parse()
