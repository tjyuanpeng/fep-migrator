import type { SFCDescriptor } from '@vue/compiler-sfc'
import { parse } from '@vue/compiler-sfc'
import fs from 'fs-extra'
import MagicString from 'magic-string'

export const parseVueSfcFile = (filename: string): [string, SFCDescriptor] => {
  const code = fs.readFileSync(filename, { encoding: 'utf-8' })
  const { descriptor } = parse(code, {
    filename,
    sourceMap: false,
  })

  return [code, descriptor]
}

export const modifySfcCodeByDescriptor = (code: string, descriptor: SFCDescriptor): [boolean, string] => {
  const ms = new MagicString(code)
  const {
    template,
    script,
    scriptSetup,
    styles,
    customBlocks,
  } = descriptor

  const blocks = [template, script, scriptSetup, ...styles, ...customBlocks]
    .filter(block => block != null)
    .sort((a, b) => {
      return a.loc.start.offset - b.loc.start.offset
    })
  blocks.reverse()

  for (const block of blocks) {
    ms.overwrite(block.loc.start.offset, block.loc.end.offset, block.content)
  }

  const hasChanged = ms.hasChanged()
  return [hasChanged, hasChanged ? ms.toString() : code]
}
