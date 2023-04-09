const zh = {
  welcome: '欢迎',
  settings: '设置',
  upload: '批量上传',

  reloadNeedSaveFirst: '文件已经修改，请先保存',
  closeModifiedFile: '文件已修改，确认关闭？',
  cannotWriteSampleFile: '示例文件不可修改',
  readFileNotExists: '文件不存在：',
  saveFileSuccess: '文件已保存',
  saveFileError: '文件保存失败 ',
  readFileError: '文件读取失败 ',

  publishSuccess: '发布成功',
  publishError: '发布失败',
  refreshSuccess: '重新加载成功',

  setting: {
    saveSettings: '设置已自动保存',
    siteSettings: '博客站点设置（自动保存）',
    siteSettingsNote: '目前兼容MetaWeblog接口的博客。以WordPress为例，URL一般是这种形式 "http://www.example.com/xmlrpc.php"',

    apiType: 'API类型',
    name: '名称',
    url: 'URL',
    username: '用户名',
    password: '密码',
    addSite: '添加站点',

    otherSettings: '其他设置',
    settingsFileLocation: '存储设置文件的位置：',
    settingsFileWarning: '更改设置文件后，需要关闭后重新打开应用才能生效',
    settingsFileWarning2: '剪切板可以导入博客文章ID和图片URL，具体查看使用教程',
    openSettingsFile: '打开设置文件',
    clipboardPaste: '剪切板粘贴',
    toNo: '到第',
    noBlog: '个博客',
    reset: '重置全部设置',
    resetConfirm: '确认重置全部设置为默认值？',
    confirmDelete: '确认删除',
    importSuccess: '导入配置成功',
    importFail: '导入配置失败，可能是格式不一致',
    renderSettings: '发布设置',
    abstract: {
      name: '摘要自动提取',
      options: {
        empty: '保持空白',
        article: '从正文提取',
        title: '使用标题'
      },
      notes: '当Meta中没有指定摘要时，摘要自动提取方式',
      abstractNum: '提取摘要的字数'
    },

    renderFeature: {
      highlight: '发布的代码是否需要高亮（默认为否）',
      mathjax: '发布是否渲染MathJax（默认为是），修改此项之后需要重新加载文章',
      options: {
        yes: '是',
        no: '否'
      },
      notes:
        '本地预览高亮代码，不渲染MathJax，但发布时可以按需是否渲染<br/> 选择是，发布的文章会做相应的处理，博客就只需配置css样式<br/> 选择否，发布的文章只是普通处理后的文本，博客需要配置对应的插件才能渲染'
    }
  },

  meta: {
    abstract: '摘要',
    file: '文件',
    url: '链接',
    time: '时间',
    categories: '分类',
    tags: '标签',
    thumbnail: '特色图片',
    other_images: '其他图片',
    empty: '(无)'
  },

  publish: {
    title: '发布到博客',
    articleID: '文章ID',
    selectSites: '选择要发布到的博客',
    settings: '博客配置',
    publishMode: '发布模式',
    publishModeManual: '手动确认',
    publishModeCreate: '创建新文章',
    publishModeAuto: '自动判断',
    publishModeManualHint: '手动确认：先模式一；若ID为0，则模式二；若模式二失败，则模式三',
    publishModeAutoHint: '自动判断：先模式二；若模式二失败，则模式三',
    publishModeCreateHint: '创建新文章：直接模式四',
    enterArticleID: '输入文章ID',
    getRemoteImages: '获取远程图片',
    forcedImageUpdate: '强制更新图片',
    notCheckingRemoteImages: '不检查远程图片',
    publishModeHint: `
    模式一：更新指定文章ID（0为不指定文章ID，会转到模式二） <br/>
    模式二：更新本地缓存获取的文章ID（相同的URL） <br/>
    模式三：创建新的文章`,
    publishModeConfirm: '发布模式确认',
    publishModeOldPost: '检测到URL相同的文章如下：',
    publishModeEditPost: '编辑此文章',
    publishModeCreatePost: '创建新文章',
    publish: '发布',
    publishing: '发布中...',
    status: {
      render: '渲染中...',
      read: '读取旧文章...',
      upload: '上传图片中...',
      publish: '发布文章中...',
      edit: '编辑文章中...',
      complete: '发布完成'
    },

    confirmUrlTitle: '确认博客信息',
    confirmUrlMessage: '博客没有配置URL，后续无法使用本工具编辑，是否继续发布？你可以从菜单打开示例文档，查看URL的配置方法。',
    confirmUrlContinue: '继续发布',
    confirmUrlOpenSample: '查看示例文档',
    confirmUrlCancel: '取消发布'
  },

  introduction: `
    <h2>简介</h2>
      <p>Push Markdown是一款将本地Markdown文件发布到博客的开源工具，基于Electron实现，支持中英文，目前已经支持windows。</p>
      <ol>
        <li>支持主流Markdown语法、TOC、代码高亮、MathJax数学公式，支持本地预览和简易编辑功能（建议使用Typora等工具编写好后，再使用本工具发布）。</li>
        <li>全自动博客发布。博客可设置标题、摘要、固定链接、作者、发布时间、标签、分类等属性，自动批量上传markdown文件中引用的本地图片。支持多站点同时发布。目前仅支持WordPress。</li>
        <li>已经通过本工具发布到远程的博客，可以使用本工具更新(博客使用固定链接即url区分)，且更新时相同图片无需重复上传(图片使用文件名区分)。</li>
      </ol>
    <h2>使用说明</h2>
    <h3>使用前一定要先参考<a href="https://gitee.com/xaotuman/push-markdown/blob/master/docs/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md">使用教程</a>！！！！！</h3>
    <ol>
      <li>从菜单打开<a href="#" data-href="settings">设置</a>，配置需要发布的博客网址和账户信息。</li>
      <li>从菜单打开要发布的Markdown文件，查看渲染结果是否正确。注意Markdown源文件必须是UTF-8编码，扩展名为<code>.md</code>。</li>
      <li>从菜单点击发布，弹窗勾选需要发布的博客，点击“发布”即可。本地预览默认使用的是GitHub风格的样式，包含浅色和深色，发布到博客后，最终效果取决于博客的CSS样式配置。</li>
      <li>如果对文档编写格式存在疑问，可以随时打开<a href="#" data-href="sample">示例文档</a>查看。</li>
      <li>如果喜欢本软件，欢迎去<a href="https://gitee.com/xaotuman/push-markdown">Gitee</a>或者<a href="https://github.com/szx741/push-markdown">GitHub</a>给我一个Star！</li>
      <li>原项目地址<a href="https://github.com/jzj1993/PublishMarkdown">GitHub</a>，<a href="http://paincker.com/publish-markdown">技术博客</a>。</li>
    </ol>
    `
};

export default zh;
