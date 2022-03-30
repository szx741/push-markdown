---

# 注释：文件开头使用YAML语法配置文章信息，之后是正常的Markdown语法
# Note: The beginning of the file uses YAML syntax to configure the blog meta data, followed by the normal Markdown syntax.

# 此处如果不配置标题，则提取Markdown中的一级标题，或使用文件名
# Title will be extracted from heading 1 of markdown or using file name if not configured here.
title: push-markdown 示例文档


# 此处如果不配置摘要，则从正文提取开头若干文字
# Abstract will be extracted from the begining of markdown content if not configured here.
abstract: 你好！这是一篇示例文档！


# URL用于固定链接、编辑文章功能，如果不配置，那么就会将标题转换为拼音，并且用"-"连接
# URL for fixed links, edit article function, if not configured, then the title will be converted to pinyin and connected with "-"
url: sample-docs-1


# 文章发布时间，使用的时区和系统设置一致，不设置则使用当前时间
# Article post time, time zone is the same as the system settings. Current time will be used if not configured here.
date: 2021-09-01 18:35:43


# 文章分类
category:
- Category1
- Category2


# 文章标签
tags:
- Tag1
- Tag222
- Tag333333
- Tag4444444444
- Tag5


---


# 标题1 Heading 1

## 标题2 Heading 2

### 标题3 Heading 3

标题H1 Heading H1
====

标题H2 Heading H2
------


## 目录 Table Of Contents

[TOC]


## 基本语法 Basic Syntax

文本 Text
换行 LineBreak

段落 Paragraph

特殊字体 **粗体** *斜体* ~~删除线~~ _下划线_
Special font **Bold** *Italic* ~~Strikethrough~~ _Underline_

水平线
Horizontal line

锚点引用（注意英文全部小写，空格之间需要用短横线-来替代，如果标题里面需要类似tab的效果，请用全角空格来替代）

Anchor references (note that all lowercase English, between the spaces need to be replaced by a short horizontal line -, if the title needs to be similar to the effect of tab, please use the full-angle space to replace)

[标题H2 Heading H2](#标题h2-heading-h2)

---


> 引用 Quote
> > 二级引用 Secondary Quote
> >
> > > 三级引用 Three-level quote

- 无序列表1 Unordered list 1
- 无序列表2 Unordered list 2

1. 有序列表1 Ordered list 1
2. 有序列表2 Ordered list 2

- 列表 List
    - 二级列表 Secondary list
        - 三级列表 Three-level list
            - 四级列表 Four-level list
    - 二级列表 Secondary list

- [x] 选中任务列表 Non-selected task list
- [ ] 非选中任务列表 Non-selected task list


## 图片与链接 Images and Links


### 网络图片 Web Images

网络图片在发布时不会自动上传。

Web images will not be uploaded when publish.

（图片地址本来在gitee上，突然被ban，不能用作外链图片了，转到github上，加载可能比较缓慢）

![网络图片](https://raw.githubusercontent.com/szx741/push-markdown/master/images/sample-web-image.png)


### 本地图片 Local Images

- 本地图片支持相对路径和绝对路径，在发布时会自动上传。

- 之前已经**使用本工具上传**的图片，再次发布**相同博客站点**时，图片无需重复上传。图片根据文件内容(md5)区分。

- Local images support relative and absolute paths, and will be automatically uploaded when publish.

- Images that have been uploaded **using this tool before**, when publishing to the **same blog site** again, the images do not need to be uploaded repeatedly. Images are identified by its file content (md5).


![本地图](sample-image.png)


### 链接 Links

点击外部链接，在系统浏览器中打开。

Click on the external link to open it in the system browser.

测试 https://gitee.com/xaotuman/push-markdown 测试

Test https://gitee.com/xaotuman/push-markdown Test


## 表格 Table

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3



## 代码高亮 Code Highlighting

### 行内代码 Inline Code

行内代码`void testMain(int args)`测试。

Inline code `void testMain(int args)` test.


### 代码块 Code Block

代码高亮由highlightjs渲染。发布时默认不进行高亮渲染，建议在博客站点中配置插件实现高亮。

Code highlighting is rendered by highlightjs. It is not highlighted by default when publishing. It is recommended to configure plugin to highlight in your blog site.

```cpp
// C++
for (int i = 0; i < 100; i++)
{
    printf("hello markdown!\n");
}
```


### WordPress配置 WordPress Configuration

对于WordPress博客，直接安装`WP Code Highlight.js`插件即可，或者使用主题内置。

For WordPress blog, just install the `WP Code Highlight.js` plugin directly, or use the theme's built-in.


## 数学公式 MathJax formula


- 公式由[MathJax](https://www.mathjax.org/)渲染，公式的识别规则和[Pandoc](http://pandoc.org/MANUAL.html#math)相同
- 公式由本地渲染后上传到网页，而不是在网页端渲染，原因一方面是我没有成功，渲染只成功一半，另一方面原因是网页端渲染比较吃力，会损耗一定的性能。


- Formula is rendered by [MathJax](https://www.mathjax.org/). The recognition rules of the formula is the same as [Pandoc](http://pandoc.org/MANUAL.html#math).
- The formula is rendered locally and then uploaded to the web page, rather than rendering on the web side, because on the one hand I did not succeed in rendering only half of the success, and on the other hand the reason is that the web-side rendering is more laborious and will lose some performance.

### WordPress配置 WordPress Configuration

配置WordPress的外观-自定义-额外CSS，加入下面这行代码。

Configure WordPress Appearance - Customize - Additional CSS and add the following line of code.

```css
mjx-container[jax="SVG"][display="true"] {
    display: block;
    text-align: center;
    margin: 1em 0;
}
```


### 行内公式 Inline formula (Inline Math)

行内公式在单个美元符号之间 $\frac{a}{b}$ 测试 $\frac{x}{123456789+123456789+123456789}$ 测试 $\delta = \beta / (\alpha + 1)$ 测试

- 如果美元符号紧跟数字，不会识别为行内公式 $20,000 and $30,000

- 如果起始美元符号紧跟空格，或终止美元符号前面是空格，也不会识别为公式 $ \frac{a}{b} $

- 行内代码不识别为公式 `$\frac{a}{b}$`


Inline formula is between single dollar signs. $\frac{a}{b}$ Test $\frac{x}{123456789+123456789+123456789}$ Test $\delta = \beta / (\alpha + 1)$ Test

- If the dollar sign is followed by a number, it will not be recognized as formula. $20,000 and $30,000.

- If the opening dollar sign have a space character immediately to its right, or the closing dollar sign have a space character immediately to its left, it will not be recognized as formula. $ \frac{a}{b} $

- Inline code will not be recognized as formula. `$\frac{a}{b}$`

### 行间公式 Interline formula (Display Math)

行间公式在两个美元符号之间。Interline formula is between two dollar signs. 

（下面这两行在typora中开启内联显示后，会顶行显示，应该被当做行内公式了，但是渲染出来的是行间公式）

$$ U_o = A^2 * ( U_+ - U_- ) $$

$$ \int_1 ^2 sin x dx $$

$$
\frac{O}{I}  \approx \frac{A}{1+AF}
$$

代码块不识别为公式。

Code block will not be recognized as formula.

```
$$
\frac{a}{b}
$$
```

方程组1
Equation 1

$$
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
$$

方程组2
Equation 2

$$
\left\{
\begin{array}{ll}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y &=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{array}
\right.
$$

