const en = {
  welcome: 'Welcome',
  settings: 'Settings',

  reloadNeedSaveFirst: 'File has been modified, please save it first',
  closeModifiedFile: 'File has been modified, confirm to close?',
  cannotWriteSampleFile: 'Cannot write sample file',
  readFileNotExists: 'File not exists: ',
  saveFileSuccess: 'File saved',
  saveFileError: 'Save file error ',
  readFileError: 'Read file error  ',

  publishSuccess: 'Publish Success',
  publishError: 'Publish Failed',
  refreshSuccess: 'Refresh Success',

  setting: {
    saveSettings: 'Settings are automatically saved',
    siteSettings: 'Blog Settings (auto save)',
    siteSettingsNote: 'Currently compatible with MetaWeblog interface blogs. Take WordPress as an example, URL is generally this form: "http://www.example.com/xmlrpc.php"',

    apiType: 'API Type',
    name: 'Name',
    url: 'URL',
    username: 'UserName',
    password: 'Password',
    addSite: 'Add Site',

    otherSettings: 'Other Settings',
    reset: 'Reset All Settings',
    resetConfirm: 'Confirm to reset all settings ?',
    confirmDelete: 'Confirm Delete',

    renderSettings: 'Publish Settings',
    abstract: {
      name: 'Abstract Extraction',
      options: {
        empty: 'Remain Empty',
        article: 'Extract from Article',
        title: 'Use Title'
      },
      notes: 'Abstract extraction when abstract is not configured in meta.',
      abstractNum: 'Number of words extracted'
    },
    renderFeature: {
      highlight: 'Code Highlight',
      mathjax: 'MathJax Formula',
      options: {
        yes: 'Yes',
        no: 'No'
      },
      nodes:
        'Preview Only：Render only when previewing locally, only pre-processing when publishing, blogs need to configure plugin to render<br/>' +
        'Preview and publish: Render when local preview and publish, blog needs to configure the corresponding CSS style<br/>' +
        'Disable: Not render when local preview and publish'
    }
  },

  meta: {
    abstract: 'Abstract',
    file: 'File',
    url: 'Url',
    time: 'Time',
    categories: 'Categories',
    tags: 'Tags',
    empty: '(Not Specified)'
  },

  publish: {
    title: 'Publish To Blog',
    articleID: 'article ID',
    selectSites: 'Select Sites To Publish',
    settings: 'Settings',
    publishMode: 'Publish Mode',
    publishModeManual: 'Manual Confirm',
    publishModeCreate: 'Create New Article',
    publishModeAuto: 'Auto',
    publishModeManualHint: 'Manual confirmation: mode one first; if ID is 0, then mode two; if mode two fails, then mode three; if mode three fails, then mode four;',
    publishModeAutoHint: 'Auto-judge: mode two first; if mode two fails, then mode three; if mode three fails, then mode four;',
    publishModeCreateHint: 'Create new article: direct mode four',
    enterArticleID: 'Enter article ID',
    getRemoteImages: 'Get remote images',
    forcedImageUpdate: 'Forced image update',
    notCheckingRemoteImages: 'Not checking remote images',
    publishModeHint: `
    Mode I: Update the specified article ID (0 is not specified article ID, will go to mode two) <br/>
    Mode 2: Update locally cached fetched article ID (same URL) <br/>
    Mode III: Update the article ID obtained remotely (same title, because getting all articles, including content, is more traffic-intensive)<br/>
    Mode 4: Create a new article `,
    publishModeConfirm: 'Confirm Publish Mode',
    publishModeOldPost: 'The article with the same URL is detected as follows:',
    publishModeEditPost: 'Edit this article',
    publishModeCreatePost: 'Create a new article',
    publish: 'Publish',
    publishing: 'Publishing...',
    status: {
      render: 'Rendering...',
      read: 'Reading old post...',
      upload: 'Uploading media...',
      publish: 'Pulishing post...',
      edit: 'Editing post...',
      complete: 'Publish complete'
    },

    confirmUrlTitle: 'Confirm blog information',
    confirmUrlMessage:
      'The blog does not have a URL configured. It cannot be edited later using this tool. Do you want to continue publishing? You can open the sample document from the menu to see how the URL is configured.',
    confirmUrlContinue: 'Continue to publish',
    confirmUrlOpenSample: 'View sample document',
    confirmUrlCancel: 'Cancel publish'
  },

  introduction: `
    <h2>Introduction</h2>
      <p>Push Markdown is an open source tool for publishing local Markdown files to blogs, based on Electron implementation, supports English and Chinese, windows and macOS are currently supported</p>
      <ol>
        <li>Supports mainstream Markdown syntax, TOC, code highlighting, <strike>MathJax math equations</strike>, local preview and easy editing features (we recommend using Haroopad, Typora and other tools to write well, then use this tool to publish). </li>
        <li>Automated blog publishing. Blog can set attributes such as title, summary, fixed link, author, publish time, tags, categories, etc. Automatically batch upload local images referenced in markdown files. Support multi-site publishing at the same time. Currently only support MetaWeblog interface, compatible with WordPress, cnblogs the two blogs, the follow-up can continue to develop other interfaces. </li>
        <li>Blogs that have been published to remote by this tool can be updated using this tool (blogs are distinguished using fixed links i.e. url), and the same images do not need to be uploaded repeatedly when updating (images are distinguished using file md5). </li>
      </ol>
    <h2>Instructions for use</h2>
    <h3>Be sure to refer to <a href="https://gitee.com/xaotuman/push-markdown/blob/master/docs/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md">tutorials</a> ！！！！！ before using </h3>
    <ol>
      <li>Open <a href="#" data-href="settings">settings</a> from menu, configure the blog URL and account information.</li>
      <li>Open the Markdown file to be published from the menu to see if the rendering is correct. Note that the Markdown source file must be UTF-8 encoded with the <code>.md</code> extension. </li>
      <li>Click Publish from the menu, check the blog you want to publish in the popup window, and click Publish. The local preview uses the GitHub style by default, but you can also change the style, and the final result depends on the blog's CSS style configuration after publishing to the blog. </li>
      <li>The post upload logic and image upload logic have been optimized to rely on more than just local caching to accommodate multiple devices and newly installed software, see my <a href="https://szx.life/push-markdown/push-markdown重构/">technical blog</a> for more details on the logic. </li>
      <li>If you have questions about the formatting of the documentation, you can always open the <a href="#" data-href="sample">example documentation</a> to see it. </li>
      <li>For more, see the <a href="https://gitee.com/xaotuman/push-markdown">Gitee</a>, <a href="https://szx.life/push-markdown/push-markdown重构/">technical blog</a>. </li>
      <li>Original project address <a href="https://github.com/jzj1993/PublishMarkdown">GitHub</a>, <a href="http://paincker.com/publish-markdown">technical blog</a>. </li>
    </ol>
    Translated with www.DeepL.com/Translator (free version)
    `
};
export default en;
