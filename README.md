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

由于原来的代码并没有进行更新维护，框架可能有点老，而且有时候有bug，因此萌生了用基于electron13、vue3和TypeScript重构代码的想法。

由于我本人并不会electron开发和vue开发，算是半个开发小白，所以也想借助最近搭建博客的热情来顺便重构一下这款软件的代码。毕竟兴趣是最好的老师，而且在别人的基础上前行，也是能够进步非常快的，希望我能够真正的完成这款软件的重构，一步一步个脚印，无限进步吧！

## wordpress设置

### 脚本替换

运行[change.sh](docs/change.sh)脚本，需要放在wordpress根目录下，或者自己改一下里面的path路径，然后给与执行权限，运行一下就行。

### 手动替换

#### base64编码

参考网址：https://www.znian.cn/823.html

图片上传默认编码发现不行，不知道为什么，原来的工具是可以支持的，明明代码都是一样的，所以需要改一下。xmlrpc将媒体文件的解码方式改为base64。

文件路径在wp-includes/class-wp-xmlrpc-server.php，因此需要

找到 mw_newMediaObject函数下面的语句

```php
$bits = $data['bits'];
```

改成下面这条语句

```php
$bits = base64_decode($data['bits']);
```

#### 上传媒体覆盖

并在后面加入这一条语句，作用是为了xmlrpc上传媒体文件时覆盖文件，而不是创建新的文件（别不改变原来前台界面上传媒体文件的逻辑，仅为xmlrpc方式）。

可以参考[网址](https://gist.github.com/koke/5720862#file-xmlrpc-test-upload-php)，或者参考我拷贝的[本地文件](docs/class-wp-xmlrpc-server.php)，在版本5.8的基础上进行的修改。

```php
if ( !empty($data['overwrite']) && ($data['overwrite'] == true) ) {
    // Get postmeta info on the object.
    $old_file = $wpdb->get_row("
		SELECT ID
    	FROM {$wpdb->posts}
		WHERE post_title = '{$name}'
		AND post_type = 'attachment'
		");

    // Delete previous file.
    wp_delete_attachment($old_file->ID);

    // Make sure the new name is different by pre-pending the
    // previous post id.
    //$filename = preg_replace('/^wpid\d+-/', '', $name);
    //$name = "wpid{$old_file->ID}-{$filename}";
}
```

## 重要版本

### v1.0.5

- 图片居中
- 修复tab转换为emsp的问题，之前为全局替换，会把代码的tab也给替换，现在只替换普通文本的tab
- 新增脚本替换Wordpress
- 修复保存标签栏的历史状态bug
- 修复没有修改状态的保存

### v1.0.4

​	对图片上传的逻辑进行了优化，也是因为多台设备和远程可能删除篡改图片的问题。

​	现在的逻辑是如果在手动模式下，选择了强制更新图片，那么就会强制覆盖原来有的图片，而且不会生成新的图片。自动覆盖的代码也需要修改wordpress的部分代码，因为wordpress的xmlrpc原本的逻辑是会生成-1,-2这样后缀的图片，而不会覆盖原来的图片，所以需要加一小段。

​	如果在手动模式下的不强制更新图片或者自动模式，那么就会检查本地缓存和远程URL有没有图片记录，如果都有，那么就不会更新图片，即便图片已经经过了修改（只看文件名称）。如果没有，那么也会进行覆盖更新。

​	因此我的建议是，在远程删除了图片，或者本地修改了图片，那么就强制更新图片，自动模式不一定有效，因为有时候还有CDN的效果，即使删除了图片，CDN还有缓存，会有影响。

​	因为wordpress5.8现在支持webp格式，因此上传也需要支持webp图片格式，就一行代码的事情。

### v1.0.3

​	对文章上传到Wordpress进行了逻辑优化，起因是开发软件的时候老是多次安装，甚至清缓存，或是多台设备试用这个软件，或者wordpress删除了文章，这就会导致原来的逻辑代码不能够适用。

​	目前的更新逻辑为下：

1. 手动确认：先模式一；若指定ID为0，则模式二；若模式二失败，则模式三；若模式三失败，则模式四；
2. 自动判断：先模式二；若模式二失败，则模式三；若模式三失败，则为模式四；
3. 创建新文章：直接模式四；

- 模式一：更新指定文章ID
- 模式二：更新本地缓存获取的文章ID（相同的URL）
- 模式三：更新远程获得的文章ID（相同的标题，因为获取所有的文章，包括内容，比较费流量）
- 模式四：创建新的文章

​	手动更新适用于第一次使用软件，或者是换了一台设备更新文章，那么就可以指定文章ID来使当前这次能够成功更新，并且在本地缓存了更新后的ID。

​	自动判断适用于就一台设备，而且有本地缓存的情况，当然没有也能够自动获取远程文章ID，除了费流量没啥硬伤。

### v1.0.0

​	终于完成了1.0.0的版本建设，10天的工作量，终于差不多把原来的源代码全部挪过来，逻辑和方法都没改，就是变成TypeScript（AnyScript😁）。虽然现在还有很多很多问题，比如去除了MathJax，因为原来的代码不能试用，而且我也没有这方面的需求，还有图片上传逻辑等等，但毕竟现在能用，就已经大告成功了。

​	可以推送博客了，好耶 ( •̀ ω •́ )✧。

## 心得体会

[心得体会](docs/心得体会.md)

## 项目搭建

[项目搭建](docs/项目搭建.md)

## 待做

- [ ] v-html改为组件模版，为了安全。
- [ ] 标题栏和菜单栏实现。
- [x] ~~文章图片cache基类这个逻辑可能还需要再重新写一遍，目前觉得用md5进行重写会不会合适一点？本地记录一下图片的名称和md5，然后比对。~~（不用md5，因为麻烦，还耗费资源，目前没看到必要性，详细看1.0.4）
- [x] ~~一个tab键转换的时候会变成一个空格键，希望能够变成一个全角空格~~（已经修复，直接将`\t`替换`&emsp;`就行了 ）。
- [ ] mathjax实现，不一定做，因为现在没用到，而且很麻烦。
- [x] 图片居中
- [ ] 记录文件打开历史
- [ ] 文件修改后有标记
- [ ] 能够有一键重载文件的按钮
- [ ] 使用typescript（即不要全用any）
- [ ] 改成vue3格式

