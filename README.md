---
# 注释：文件开头使用YAML语法配置文章信息，之后是正常的Markdown语法
# Note: The beginning of the file uses YAML syntax to configure the blog meta data, followed by the normal Markdown syntax.

# 此处如果不配置标题，则提取Markdown中的一级标题，或使用文件名
# Title will be extracted from heading 1 of markdown or using file name if not configured here.
title: psuh markdown


# 此处如果不配置摘要，则从正文提取开头若干文字
# Abstract will be extracted from the begining of markdown content if not configured here.
abstract: 关于push markdown。

# URL用于固定链接、编辑文章功能，建议所有文章都配置
# URL is used for permalink and article editing, and it is recommended to be configured.
url: markdown


# 文章发布时间，使用的时区和系统设置一致，不设置则使用当前时间
# Article post time, time zone is the same as the system settings. Current time will be used if not configured here.
date: 


# 文章分类
category:
- 图一乐
- 网站建设


# 文章标签
tags:
- 图一乐
- 网站建设

---

# Push Markdown

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/meituan/WMRouter/master/LICENSE)

此代码是基于[Publish Markdown](https://github.com/jzj1993/PublishMarkdown)重构的。

原代码地址：https://github.com/jzj1993/PublishMarkdown

XML-RPC网址：https://codex.wordpress.org/zh-cn:XML-RPC_Support（需要翻墙）、https://developer.wordpress.org/apis/handbook/xml-rpc/

## 简介

​	由于原来的代码并没有进行更新维护，框架可能有点老，而且有时候有bug，因此萌生了用基于electron13、vue3和TypeScript重构代码的想法。

​	由于我本人并不会electron开发和vue开发，算是半个开发小白，所以也想借助最近搭建博客的热情来顺便重构一下这款软件的代码。毕竟兴趣是最好的老师，而且在别人的基础上前行，也是能够进步非常快的，希望我能够真正的完成这款软件的重构，一步一步个脚印，无限进步吧！

## wordpress设置

参考网址：https://www.znian.cn/823.html

图片上传默认编码发现不行，不知道为什么，原来的工具是可以支持的，明明代码都是一样的，所以需要改一下。xmlrpc将媒体文件的解码方式改为base64

文件路径在wp-includes/class-wp-xmlrpc-server.php，因此需要

找到 mw_newMediaObject函数下面的语句

```php
$bits = $data['bits'];
```

改成下面这条语句

```php
$bits = base64_decode($data['bits']);
```

## 版本

### 1.0.0

​	终于完成了1.0.0的版本建设，10天的工作量，终于差不多把原来的源代码全部挪过来，逻辑和方法都没改，就是变成TypeScript（AnyScript😁）。虽然现在还有很多很多问题，比如去除了MathJax，因为原来的代码不能试用，而且我也没有这方面的需求，还有图片上传逻辑等等，但毕竟现在能用，就已经大告成功了。

​	可以推送博客了，好耶 ( •̀ ω •́ )✧。

## 心得体会

[心得体会](docs/心得体会.md)

## 项目搭建

[项目搭建](docs/项目搭建.md)

## 待做

- [ ] v-html改为组件模版，为了安全。
- [ ] 标题栏和菜单栏实现。
- [ ] 文章图片cache基类这个逻辑可能还需要再重新写一遍，目前觉得用md5进行重写会不会合适一点？本地记录一下图片的名称和md5，然后比对

