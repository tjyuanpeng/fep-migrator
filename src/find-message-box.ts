import ripgrep from './utils/run-ripgrep'

const finder = async (options: Options) => {
  const searchText = '.el-message-box'
  const stdout = await ripgrep(searchText, options)
  if (!stdout) {
    return
  }

  const list = stdout.split('\n').map(line => JSON.parse(line))
  list.filter(i => i.type === 'summary').forEach((i) => {
    console.log(`\n⚠️  发现 ${i.data.stats.searches_with_match} 个文件，在css中设置了'${searchText}'。如无必要请不要覆盖messagebox的css设置，请及时修改。`)
  })
  list.filter(i => i.type === 'match').forEach((i) => {
    console.log(`➡️  ${i.data.path.text}:${i.data.line_number}`)
    console.log(i.data.lines.text.replace('\n', ''))
  })
}

export default finder
