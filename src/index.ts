import path from 'node:path'
import process from 'node:process'
import { parse } from '@vue/compiler-sfc'
import { cac } from 'cac'
import { init as initEsm, parse as parseEsm } from 'es-module-lexer'
import fs from 'fs-extra'
import { globbySync } from 'globby'
import MagicString from 'magic-string'
import ora from 'ora'
import descriptorToString from 'vue-sfc-descriptor-to-string'

const resolveFep = (content: string) => {
  const ms = new MagicString(content)
  const [imports] = parseEsm(content)

  for (let i = imports.length - 1; i >= 0; i--) {
    const imp = imports[i]
    const originalPath = imp.n

    // 跳过空路径、动态导入（可根据需求扩展动态导入处理）
    if (!originalPath || imp.d > -1 || imp.d === -2) {
      continue
    }

    const elementPlusRegex = /^element-plus(\/.*)?$/
    const fontRegex = /^@element-plus\/icons-vue(\/.*)?$/
    if (elementPlusRegex.test(originalPath)) {
      const newPath = originalPath.replace(elementPlusRegex, '@falconix/fep$1')
      ms.overwrite(imp.s, imp.e, newPath)
    } else if (fontRegex.test(originalPath)) {
      const newPath = originalPath.replace(fontRegex, '@falconix/icons-vue$1')
      ms.overwrite(imp.s, imp.e, newPath)
    }
  }

  return ms.toString()
}

const readVueFile = (filename: string) => {
  const content = fs.readFileSync(filename, { encoding: 'utf-8' })
  const { descriptor } = parse(content, {
    filename,
    sourceMap: false,
  })
  return descriptor
}

const getRelativePath = (base: string, target: string) => {
  return path.relative(base, target)
}

const main = () => {
  const cli = cac('fep-migrator')
  cli
    .version('1.0.0')
    .command('<...dir>', '处理路径')
    .action(async (dirs) => {
      await initEsm
      const root = process.cwd()
      const spinner = ora(`🦄 开始迁移...`).start()
      const fileList = globbySync(dirs, {
        absolute: true,
        onlyFiles: true,
        gitignore: true,
        expandDirectories: {
          extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
        },
        ignore: ['**/node_modules', '**/*.d.ts', '**/public'],
      })
      const statistic = {
        success: 0,
        fail: 0,
        total: fileList.length,
      }
      for (const file of fileList) {
        try {
          if (file.endsWith('.vue')) {
            const descriptor = readVueFile(file)
            let changed = false
            if (descriptor.script) {
              const newScript = resolveFep(descriptor.script.content)
              if (newScript !== descriptor.script.content) {
                changed = true
                descriptor.script.content = newScript
              }
            }
            if (descriptor.scriptSetup) {
              const newScriptSetup = resolveFep(descriptor.scriptSetup.content)
              if (newScriptSetup !== descriptor.scriptSetup.content) {
                changed = true
                descriptor.scriptSetup.content = newScriptSetup
              }
            }
            if (changed) {
              const resolved = descriptorToString(descriptor)
              fs.writeFileSync(file, resolved)
            }
          } else {
            const content = fs.readFileSync(file, { encoding: 'utf-8' })
            const resolved = resolveFep(content)
            if (resolved !== content) {
              fs.writeFileSync(file, resolved)
            }
          }
          statistic.success++
        } catch (e) {
          statistic.fail++
          spinner.fail(`❌ 处理错误: [${getRelativePath(root, file)}], error:${e}`)
        }
      }

      spinner.info(`🦄 所有文件迁移完成。共处理 ${statistic.total} 个文件，成功 ${statistic.success} 个，失败 ${statistic.fail} 个`)
    })
  cli.help()
  cli.parse()
}

export default main
