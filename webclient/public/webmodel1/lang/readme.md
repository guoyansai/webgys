# 语言包使用说明

1. 在langs中添加语言标识和名称，如："temp": "新语言";

```json
{
  "langs": {
    "temp": "新语言", // 添加新语言
    "zh-CN": "简体中文",
    "en": "English"
  },
  "dir": ["保持原样..."]
}
```

2. 修改你下载的语言包目录名称为新语言包标识，如：temp;
3. 修改yaml文件名为新语言包标识，如：temp.yaml;
4. 将语言包压缩重命名为语言包标识的名字，如：temp.zip;

```
temp.zip语言压缩包的文件与文件夹结构如下：
    ├── 📂temp
        ├── 📂cocontrol
        ├── 📂其他文件夹...
    ├── 📃temp.yaml
    ├── 📃dirlang.json
```

5. 通过上传语言包功能上传temp.zip文件，完成后重启应用新语言包即可使用。

# Language Package Usage Instructions

1. Add language identifier and name in langs, e.g.: "temp": "New Language";

```json
{
  "langs": {
    "temp": "New Language", // Add new language
    "zh-CN": "简体中文",
    "en": "English"
  },
  "dir": ["Keep as is..."]
}
```

2. Modify the downloaded language package directory name to the new language package identifier, e.g.: temp;
3. Modify the yaml file name to the new language package identifier, e.g.: temp.yaml;
4. Compress and rename the language package to the language package identifier name, e.g.: temp.zip;

```
The file and folder structure of temp.zip language package is as follows：
    ├── 📂temp
        ├── 📂cocontrol
        ├── 📂Other folders...
    ├── 📃temp.yaml
    ├── 📃dirlang.json
```

5. Upload the temp.zip file through the upload language package function. After completion, restart the application and the new language package can be used.
