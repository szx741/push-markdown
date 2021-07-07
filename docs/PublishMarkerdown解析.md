# PublishMarkerdown解析

还是要先对原文档进行一边解析，看看结构是什么构造。

## src目录下的文件结构

```
src
│  index.ejs	应该是electron生成的页面
│  README.md	
│
├─common	在主进程和渲染进程都会用到的代码
│      lang-config.js	使用electron-store来存储语言设置（即是中文还是英文）
│
├─main	主进程
│      AppMenu.js	 菜单栏的设置	
│      index.dev.js		开发环境的配置，加载electron-debug和vue-devtools
│      index.js			   electron入口文件，也是最重要的配置文件
│      language.js		菜单栏的语言
│
└─renderer				渲染进程
    │  App.vue			 VUE最初的父文件	
    │  main.js			   VUE入口文件
    │
    ├─assets			  样式
    │      .gitkeep		  空文件
    │      close.png 	 关闭图片
    │      MathJax.css  数学公式的样式
    │      style.scss		全局样式
    │
    ├─components	vue组件
    │      Main.vue			主窗口，包含标签栏，页面容器，状态栏
    │      Markdown.vue	Markdown预览页面
    │      Publish.vue		发布窗口
    │      Settings.vue		设置页面
    │      TabTitle.vue		单个标签，含标题和关闭按钮
    │      Welcome.vue	 欢迎页面
    │
    ├─logic	逻辑层面
    │  │  config.js			 用户设置
    │  │  lang.js			  全局的语言，包含中文和英文
    │  │  statusBar.js		状态栏信息显示
    │  │  useRecord.js	  用户信息保存，包括标签页信息的保存
    │  │  utils.js				方法工具，包括
    │  │
    │  ├─publisher		推送博客的逻辑代码
    │  │      BasePublisher.js		博客发布基类，可以有多种实现
    │  │      index.js						文章发布工具。根据type调用不同的实现。目前支持MetaWeblog。
    │  │      MetaWeblogPublisher.js	基于MetaWeblog接口的博客发布器，支持WordPress等博客
    │  │      PublishCache.js		文章、图片发布缓存，避免文章、图片重复发布
    │  │
    │  └─renderer	渲染markdown代码
    │          index.js		渲染器，用于本地预览和远程发布
    │          markdown-it-mathjax.js
    │          markdown-it-mermaid.js
    │          mathjax-front-renderer.js
    │          mermaid-front-renderer.js
    │
    └─router	vue-router配置，其实就一个界面
            index.js
```

发现这个结构还是比较清晰明了的，分为主进程（electron的主配置）和渲染进程（vue界面、发布博客代码和渲染markdown代码）。