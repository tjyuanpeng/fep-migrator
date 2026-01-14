# fep-migrator

@falconix fep 迁移工具

## 使用

```shell
npx fep-migrator <...dir>
```

`dir` 为需要迁移的 fep 项目目录

支持多个目录同时迁移，例如：

```shell
fep-migrator web mobile
```

可以使用glob语法排除掉文件夹，例如：

```shell
fep-migrator . "!**/public"
```

## 注意事项

使用前请备份好文件，确保文件已经提交到git仓库

`fep-migrator` 会迁移两个包的内容：

- element-plus => @falconix/fep

- @element-plus/icons-vue => @falconix/icons-vue

`fep-migrator` 会检测文件中是否含有 `font-family:` 如果有，会提示用户修改
