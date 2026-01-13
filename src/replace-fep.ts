import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { globbySync } from 'globby'
import MagicString from 'magic-string'
import { parseSync } from 'oxc-parser'
import { modifySfcCodeByDescriptor, parseVueSfcFile } from './sfc'

const resolveFep = (code: string, filename: string): [boolean, string] => {
  const ms = new MagicString(code)
  const { program } = parseSync(filename, code, { lang: 'tsx' })
  const imports = program.body.filter(i => i.type === 'ImportDeclaration').reverse()
  for (const importItem of imports) {
    const { raw, start, end } = importItem.source
    const text = raw ?? ''
    const epRegex = /^(['"])element-plus/
    const iconRegex = /^(['"])@element-plus\/icons-vue/
    if (epRegex.test(text)) {
      const newPath = text.replace(epRegex, (_all, p1) => {
        return `${p1}@falconix/fep`
      })
      ms.overwrite(start, end, newPath)
    } else if (iconRegex.test(text)) {
      const newPath = text.replace(iconRegex, (_all, p1) => {
        return `${p1}@falconix/icons-vue`
      })
      ms.overwrite(start, end, newPath)
    }
  }
  const hasChanged = ms.hasChanged()
  return [hasChanged, hasChanged ? ms.toString() : code]
}

async function replacer(dirs: string[]) {
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
        const [code, descriptor] = parseVueSfcFile(file)
        let changed = false
        if (descriptor.script) {
          const [hasChanged, newScript] = resolveFep(descriptor.script.content, file)
          if (hasChanged) {
            changed = true
            descriptor.script.content = newScript
          }
        }
        if (descriptor.scriptSetup) {
          const [hasChanged, newScriptSetup] = resolveFep(descriptor.scriptSetup.content, file)
          if (hasChanged) {
            changed = true
            descriptor.scriptSetup.content = newScriptSetup
          }
        }
        if (changed) {
          const [_changed, resolved] = modifySfcCodeByDescriptor(code, descriptor)
          fs.writeFileSync(file, resolved)
        }
      } else {
        const content = fs.readFileSync(file, { encoding: 'utf-8' })
        const [hasChanged, resolved] = resolveFep(content, file)
        if (hasChanged) {
          fs.writeFileSync(file, resolved)
        }
      }
      statistic.success++
    } catch (e) {
      statistic.fail++
      console.error(`❌ 处理错误: [${path.relative(process.cwd(), file)}], error:${e}`)
      throw e
    }
  }
  return statistic
}

export default replacer
