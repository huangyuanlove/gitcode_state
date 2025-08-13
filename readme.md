<p align="center">
 <img width="100px" src="https://res.cloudinary.com/anuraghazra/image/upload/v1594908242/logo_ccswme.svg" align="center" alt="GitCode Readme Stats" />
 <h2 align="center">GitCode Readme Stats</h2>
 <p align="center">在你的 README 中获取动态生成的 GitCode 统计信息！</p>
 <p align="center">基于 <a href='https://github.com/anuraghazra/github-readme-stats'>github-readme-stats</a> 项目做的修改</p>
</p>

# 提示 <!-- omit in toc -->
由于 gitcode 开放接口有限，无法完全实现原项目中的所有功能。
* 目前只做了展示所有 star 数量，没有进行等级计算。
* 热门语言修改为了统计所有仓库中的编程语言占用比例。
* 带有删除线的功能均未实现

# 前置工作 <!-- omit in toc -->
由于 GitCode 开放接口访问需要 `access_token`,因此需要在`个人设置`-->`访问令牌`中创建一个只读的访问令牌(后面称为 access_token或者 token)。
如果直接使用他人提供的链接，会有暴漏 token 的风险，因此建议自己部署一下服务，将 token 和 username写到环境变量中。

本项目提供的链接为 **https://gitcode-state.vercel.app/api/**，如果使用本项目提供的链接，则需要在链接末尾拼接`username=xxx&access_token=yyy`,将 xxx 替换为自己的 gitcode 用户名(**需要用户名而非昵称**)，yyy 替换为自己的 token。
如果自己部署服务，可以将`username` 和`access_token`写入环境变量中，对应的 key 为`gitcode_token`和`username`，然后替换一下链接就行，后面参数是通用的。

由于`vercel`无法从`gitcode`获取代码，我们可以从[github](https://github.com/huangyuanlove/gitcode_state)上`fork`本仓库到自己的账号下进行部署

# 特性 <!-- omit in toc -->



- [GitCode 统计卡片](#gitcode-统计卡片)
    - [隐藏指定统计](#隐藏指定统计)
    - [~~将私人项目贡献添加到总提交计数中~~](#将私人项目贡献添加到总提交计数中)
    - [显示图标](#显示图标)
    - [主题](#主题)
      - [所有现有主题](#所有现有主题)
    - [自定义](#自定义)
        - [bg\_color 渐变](#bg_color-渐变)
      - [统计卡片专属选项:](#统计卡片专属选项)
      - [~~Repo 卡片专属选项~~:](#repo-卡片专属选项)
      - [语言卡片专属选项:](#语言卡片专属选项)
- [主要使用的编程语言](#主要使用的编程语言)
    - [使用细则](#使用细则)
    - [隐藏指定语言](#隐藏指定语言)
    - [紧凑的语言卡片布局](#紧凑的语言卡片布局)
    - [全部 Demos](#全部-demos)
  - [自己部署](#自己部署)
      - [查看分步视频教程 作者：@codeSTACKr](#查看分步视频教程-作者codestackr)

# GitCode 统计卡片

将这行代码复制到你的 markdown 文件中，就是如此简单！

```md
![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state)
```

### 隐藏指定统计

想要隐藏指定统计信息，你可以调用参数 `?hide=`，其值用 `,` 分隔。

> 选项：`&hide=stars,commits,prs,issues,contribs`

```md
![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?hide=contribs,prs)
```

### ~~将私人项目贡献添加到总提交计数中~~

你可以使用参数 `?count_private=true` 把私人贡献计数添加到总提交计数中。

_注：如果你是自己部署本项目，私人贡献将会默认被计数，如果不是自己部署，你需要分享你的私人贡献计数。_

> 选项: `&count_private=true`

```md
![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?count_private=true)
```

### 显示图标

如果想要显示图标，你可以调用 `show_icons=true` 参数，像这样：

```md
![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?show_icons=true)
```

### 主题

你可以通过现有的主题进行卡片个性化，省去[手动自定义](#自定义)的麻烦。

通过调用 `?theme=THEME_NAME` 参数，像这样：

```md
![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?show_icons=true&theme=radical)
```

#### 所有现有主题

dark, radical, merko, gruvbox, tokyonight, onedark, cobalt, synthwave, highcontrast, dracula


### 自定义

你可以通过使用 URL 参数的方式，为你的 `Stats Card` 或 ~~`Repo Card`~~ 自定义样式。

常用选项：

- `title_color` - 卡片标题颜色 _（十六进制色码）_
- `text_color` - 内容文本颜色 _（十六进制色码）_
- `icon_color` - 图标颜色（如果可用）_（十六进制色码）_
- `bg_color` - 卡片背景颜色 _（十六进制色码）_ **或者** 以 _angle,start,end_ 的形式渐变
- `hide_border` - 隐藏卡的边框 _(布尔值)_
- `theme` - 主题名称，从[所有可用主题](../themes/README.md)中选择
- `cache_seconds` - 手动设置缓存头 _（最小值: 14400，最大值: 86400）_
- `locale` - 在卡片中设置语言 _(例如 cn, de, es, 等等)_

##### bg_color 渐变

你可以在 bg_color 选项中提供多个逗号分隔的值来呈现渐变，渐变的格式是 :-

```
&bg_color=DEG,COLOR1,COLOR2,COLOR3...COLOR10
```

> 缓存的注意事项: 如果 fork 数和 star 数 少于 1k , Repo 卡片默认缓存是 4 小时 （14400 秒） ，否则是 2 小时（7200）。另请注意缓存被限制为最短 2 小时，最长 24 小时。

#### 统计卡片专属选项:

- `hide` - 隐藏特定统计信息 _(以逗号分隔)_
- `hide_title` - _(boolean)_
- `hide_rank` - _(boolean)_
- `show_icons` - _(boolean)_
- `include_all_commits` - 统计总提交次数而不是仅统计今年的提交次数 _(boolean)_
- `count_private` - 统计私人提交 _(boolean)_
- `line_height` - 设置文本之间的行高 _(number)_

#### ~~Repo 卡片专属选项~~:

- `show_owner` - 显示 Repo 的所有者名字 _(boolean)_

#### 语言卡片专属选项:

- `hide` - 从卡片中隐藏指定语言 _(Comma seperated values)_
- `hide_title` - _(boolean)_
- `layout` - 提供五种布局 `normal` & `compact` & `donut` & `donut-vertical` & `pie` 间切换
- `card_width` - 手动设置卡片的宽度 _(number)_

> :warning: **重要:**
> 如 [Percent Encoding](https://en.wikipedia.org/wiki/Percent-encoding) 所指定，语言名称应使用 uri 转义。
> (例: `c++` 应该是 `c%2B%2B`, `jupyter notebook` 应该是 `jupyter%20notebook`, 等.)

---


# 主要使用的编程语言

统计用户名下权限为 owner 权限的仓库中所用语言的占比

### 使用细则

将此代码复制粘贴到您的 `README.md` 文件中，并修改链接。

```md
![huangyuanlove's gitcode language](https://gitcode-state.vercel.app/api/language)
```

### 隐藏指定语言

可以使用 `?hide=language1,language2` 参数来隐藏指定的语言。

```md
![huangyuanlove's gitcode language](https://gitcode-state.vercel.app/api/language?hide=javascript,html)
```

### 紧凑的语言卡片布局

你可以使用 `&layout=compact` 参数来改变卡片的样式。

```md
![huangyuanlove's gitcode language](https://gitcode-state.vercel.app/api/language?layout=compact)
```


### 全部 Demos

- 默认

![huangyuanlove's gitcode stats](https://github-readme-stats.vercel.app/api?username=anuraghazra)

- 隐藏指定统计

![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?hide=contribs,issues)

- 显示图标

![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?hide=issues&show_icons=true)

- ~~包含全部提交~~

![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?include_all_commits=true)

- 主题

从[默认主题](#主题)中进行选择

![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?show_icons=true&theme=radical)

- 渐变

![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?bg_color=30,e96443,904e95&title_color=fff&text_color=fff)

- 自定义统计卡片

![huangyuanlove's gitcode stats](https://gitcode-state.vercel.app/api/state?show_icons=true&title_color=fff&icon_color=79ff97&text_color=9f9f9f&bg_color=151515)

- 自定义 repo 卡片

![Customized Card](https://gitcode-state.vercel.app/api/pin?repo=huangyuan_xuan/gitcode_state&title_color=fff&icon_color=f9f9f9&text_color=9f9f9f&bg_color=151515)

- 主要编程语言

![Top Langs](https://gitcode-state.vercel.app/api/language)

---



## 自己部署

#### [查看分步视频教程 作者：@codeSTACKr](https://youtu.be/n6d4KHSKqGk?t=107)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/huangyuanlove/gitcode_state)
由于`vercel`无法从`gitcode`获取代码，我们可以从[github](https://github.com/huangyuanlove/gitcode_state)上`fork`本仓库到自己的账号下进行部署

<details>
 <summary>设置 Vercel 的指导</summary>

1. 前往 [vercel.com](https://vercel.com/)
2. 点击 `Log in`
   ![](https://files.catbox.moe/tct1wg.png)
3. 点击 `Continue with GitHub` 通过 GitHub 进行登录
   ![](https://files.catbox.moe/btd78j.jpeg)
4. 登录 GitHub 并允许访问所有存储库（如果系统这样提示）
5. Fork 这个仓库
6. 返回到你的 [Vercel dashboard](https://vercel.com/dashboard)
7. 选择 `Import Project`
   ![](https://files.catbox.moe/qckos0.png)
8. 选择 `Import Git Repository`
   ![](https://files.catbox.moe/pqub9q.png)
9. 选择 root 并将所有内容保持不变，并且只需添加名为 `username`和`gitcode_token` 的环境变量（如图所示）
10. 点击 deploy，这就完成了，查看你的域名就可使用 API 了！

</details>

