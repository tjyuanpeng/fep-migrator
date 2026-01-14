import { rgPath } from '@vscode/ripgrep'
import { execa } from 'execa'

const finder = async (dirs: string[]) => {
  const searchText = 'font-family:'
  const d = dirs.reduce<any[]>((acc, cur) => {
    acc.push(cur.startsWith('!') ? ['--glob', cur] : cur)
    return acc
  }, []).flat()

  const args = [
    searchText,
    '-l',
    '--json',
    ...(d),
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
  if (exitCode !== 0) {
    if (exitCode === 2) {
      console.error(`❌ ripgrep 运行错误：`)
      console.error(stderr)
    }
    return
  }
  const list = stdout.split('\n').map(line => JSON.parse(line))
  list.filter(i => i.type === 'summary').forEach((i) => {
    console.log(`⚠️  发现 ${i.data.stats.searches_with_match} 个文件，在css中设置了'font-family'。如无必要请不要覆盖项目的字体设置，请及时修改。`)
  })
  list.filter(i => i.type === 'match').forEach((i) => {
    console.log(`➡️  ${i.data.path.text}:${i.data.line_number}`)
    console.log(i.data.lines.text)
  })
}

export default finder
