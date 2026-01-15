interface Options {
  root: string
  exclude: string[]
  pkgManager: 'pnpm' | 'npm' | 'yarn'
  dryRun: boolean
}
