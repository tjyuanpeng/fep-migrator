import { execa } from 'execa'

const run = async (command: string, args: string[], options: any) => {
  console.log(`➡️  执行: ${[command, ...args].join(' ')}`)
  if (options.dryRun) {
    return
  }
  const { exitCode } = await execa(command, args, {
    cwd: options.root,
    stdio: ['ignore', 'inherit', 'inherit'],
    reject: false,
  })
  if (exitCode !== 0) {
    throw new Error(`❌ 执行失败: ${[command, ...args].join(' ')}`)
  }
  return exitCode
}

export default run
