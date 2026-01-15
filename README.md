# fep-migrator

@falconix fep 迁移工具

## 使用

在项目根目录执行命令

```shell
npx fep-migrator
```

## 选项

- `--pkg-manager` 或 `-p` 指定包管理器，默认值为 `pnpm`

- `--exclude` 或 `-e` 排除指定目录

  使用glob语法，支持设置多个目录，例如：

  ```shell
  fep-migrator --exclude "**/public" --exclude "**/assets"
  ```

- `--dry-run` 或 `-d` 模拟运行，不实际修改文件

## 注意事项

使用前请备份好文件，确保文件已经提交到git仓库

`fep-migrator` 会迁移两个包的内容：

- element-plus => @falconix/fep

- @element-plus/icons-vue => @falconix/icons-vue

`fep-migrator` 会检测文件中是否含有 `font-family:` 如果有，会提示用户修改

`fep-migrator` 会检测文件中是否含有 `.el-message-box` 如果有，会提示用户修改
