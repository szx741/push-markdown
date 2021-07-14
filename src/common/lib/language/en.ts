const en = {
  welcome: 'Welcome',
  settings: 'Settings',

  closeModifiedFile: 'File has been modified, confirm to close?',
  cannotWriteSampleFile: 'Cannot write sample file',
  readFileNotExists: 'File not exists: ',
  saveFileSuccess: 'File saved',
  saveFileError: 'Save file error ',
  readFileError: 'Read file error  ',

  publishSuccess: 'Publish Success',
  publishError: 'Publish Failed',

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

    renderSettings: 'Render Settings',
    abstract: {
      name: 'Abstract Extraction',
      options: {
        empty: 'Remain Empty',
        article: 'Extract from Article',
        title: 'Use Title'
      },
      notes: 'Abstract extraction when abstract is not configured in meta.'
    },
    renderFeature: {
      highlight: 'Code Highlight',
      mathjax: 'MathJax Formula',
      mermaid: 'Mermaid Diagrams',
      options: {
        previewOnly: 'Preview Only',
        previewAndPublish: 'Preview and Publish',
        disable: 'Disable'
      },
      nodes:
        '[Default] Preview Only：Render only when previewing locally, only pre-processing when publishing, blogs need to configure plugin to render<br/>' +
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
    selectSites: 'Select Sites To Publish',
    settings: 'Settings',
    publishMode: 'Publish Mode',
    publishModeManual: 'Manual Confirm',
    publishModeCreate: 'Create New Article',
    publishModeAuto: 'Auto',
    publishModeHint: 'Create a new article or edit an existing article when a published article with the same URL detected.',
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

  introduction:
    '<h2>Introduction</h2>' +
    '<p>Publish Markdown is an open source tool for publishing local Markdown files to blogs, based on Electron, supporting Chinese and English, compatible with Windows, Linux, and MacOS platforms.</p>' +
    '<ol>' +
    '<li>Support mainstream Markdown syntax, TOC, code highlighting, MathJax formula. Provide local preview and simple Markdown editing functions (It is recommended to use Haroopad, Typora and other tools to write and use this tool to publish).</li>' +
    '<li>Full automatically blog posting. Many meta data can be set for blogs, including title, abstract, permalink, create time, tags, categories, etc. Local images in blog will be automatically uploaded. Publishing to multiple sites simultaneously is also supported. Currently support MetaWeblog interface, compatiable with WordPress, csdn, cnblogs, oschina, etc.</li>' +
    '<li>Blogs which already be published with this tools can be updated (blogs are identified by permalink), and the same image will be reused other than uploading repeatedly when editing the blog (images are identified by file md5).</li>' +
    '</ol>' +
    '<h2>Usage</h2>' +
    '<ol>' +
    '<li>Open <a href="#" data-href="settings">settings</a> from menu, configure the blog URL and account information.</li>' +
    '<li>Open the Markdown file to be published from menu and see if the rendering result is correct. Note that the markdown source file must be UTF-8 encoded with extension <code>.md</code>.</li>' +
    '<li>Click publish from menu, select the blog sites that needs to be published to, click "Publish". Local previews use GitHub styles, and when published to a blog, the final effect depends on the CSS style configuration of the blog.</li>' +
    '<li>For articles <b>published using this tool</b>, when you publish to the <b>same site</b> again using the <b>same URL</b>, you can choose to edit existing articles or create new ones at the time of publishing.</li>' +
    '<li>If you have questions about the format of your document, you can open the <a href="#" data-href="sample">sample markdown file</a> at any time.</li>' +
    '<li>For more infomation, please visit <a href="https://github.com/jzj1993/PublishMarkdown">GitHub</a>, <a href="http://paincker.com/publish-markdown">Tech Blog</a>.</li>' +
    '</ol>'
};
export default en;
