module.exports = {
  appId: 'com.szx741ifp1090.pushmarkdown', // 请替换为您的应用程序 ID
  productName: 'Push Markdown', // 请替换为您的应用程序名称
  directories: {
    output: 'dist',
  },
  files: ['packages/main/dist/**/*', 'packages/preload/dist/**/*', 'packages/renderer/dist/**/*', 'node_modules/**/*'],
  mac: {
    icon: '/Users/guyan/Downloads/push-markdown-master/public/App.icns', // 请替换为您的图标文件的路径
    target: ['dmg', 'zip'],
  },
};
