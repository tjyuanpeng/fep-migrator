import { rgPath } from '@vscode/ripgrep'
import { execa } from 'execa'

const run = async (searchText: string, options: Options): Promise<string | null> => {
  const exclude = options.exclude.reduce<any[]>((acc, cur) => {
    acc.concat(['-g', `!${cur}`])
    return acc
  }, [])
  const args = [
    searchText,
    '-l',
    '--json',
    options.root,
    ...(exclude),
    '-g',
    '*.{css,scss,less,vue}',
    '-g',
    '!**/node_modules/**',
    '-g',
    '!**/public/**',
  ]

  const { exitCode, stdout, stderr } = await execa(rgPath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    reject: false,
  })

  if (exitCode === 1) {
    return null
  } else if (exitCode === 2) {
    throw new Error(`❌ ripgrep 执行失败：${stderr}`)
  }

  return stdout
}

export default run
