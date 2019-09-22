var webpack = require('webpack')
var GitRevisionPlugin = require('git-revision-webpack-plugin')
var gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'BRANCH': JSON.stringify(gitRevisionPlugin.branch())
      })
    ]
  }
}
