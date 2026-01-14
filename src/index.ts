#!/usr/bin/env node

import process from 'node:process'
import { cac } from 'cac'
import finder from './find-font-family'
import replaceFep from './replace-fep'

const cli = cac('fep-migrator')
cli.command('<...dir>', '处理路径')
  .action(async (dirs) => {
    await replaceFep(dirs)
    await finder(dirs)
  })
cli.version(process.env.npm_package_version ?? '-.-.-')
cli.help()
cli.parse()
