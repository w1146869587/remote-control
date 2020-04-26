const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // webpack的相关配置
  configureWebpack: {
    entry: './src/renderer/main.js',
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts'],
      alias: {
        '@': resolve('src/renderer')
      }
    }
  },
  // 开发服务器http代理
  devServer: {
    open: !process.argv.includes('electron:serve'),
    host: 'localhost',
    port: 9080,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:9999/',
        changeOrigin: true, // 是否跨域
        ws: true, // 代理长连接
        pathRewrite: {
          '^/api': '/'
        } // 重写接口
      },
      '/socket': {
        target: 'ws://localhost:9999/',
        ws: true
      }
    }
  }, // 第三方插件配置
  pluginOptions: {
    // vue-cli-plugin-electron-builder配置
    electronBuilder: {
      builderOptions: {
        win: {
          // 图标路径 windows系统中icon需要256*256的ico格式图片，更换应用图标亦在此处
          icon: 'build/electron-icon/icon.ico',
          // artifactName: '${productName}_Setup_${version}.${ext}',
          target: [
            {
              // 打包成一个独立的 exe 安装程序
              target: 'nsis',
              // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
              // 'arch': [
              //   'x64',
              //   'ia32'
              // ]
              arch: ['ia32']
            }
          ]
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        mas: {
          icon: 'build/electron-icon/icon.icns',
          entitlements: 'build/entitlements.mas.plist',
          provisioningProfile: 'embedded.provisionprofile'
        },
        mac: {
          icon: 'build/electron-icon/icon.icns',
          category: 'public.app-category.finance',
          entitlements: 'build/entitlements.mac.plist',
          extendInfo: {
            ElectronTeamID: 'electron-vue-sunrise',
            'com.apple.developer.team-identifier': 'electron-vue-sunrise',
            'com.apple.application-identifier': 'electron-vue-sunrise'
          },
          target: [
            {
              target: 'dmg'
            },
            {
              target: 'zip'
            }
            // {
            //   'target': 'pkg'
            // },
            // {
            //   'target': 'mas'
            // }
          ]
        },
        files: ['**/*'],
        asar: true,
        nsis: {
          // 是否一键安装，建议为 false，可以让用户点击下一步、下一步、下一步的形式安装程序，如果为true，当用户双击构建好的程序，自动安装程序并打开，即：一键安装（one-click installer）
          oneClick: false,
          // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowElevation: true,
          // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
          allowToChangeInstallationDirectory: true,
          // 安装图标
          installerIcon: 'build/electron-icon/icon.ico',
          // 卸载图标
          uninstallerIcon: 'build/electron-icon/icon.ico',
          // 安装时头部图标
          installerHeaderIcon: 'build/electron-icon/icon.ico',
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true
        }
      },
      chainWebpackMainProcess: config => {
        config.plugin('define').tap(args => {
          args[0].IS_ELECTRON = true
          return args
        })
        // config.resolve.alias.set('@', resolve("src/renderer"))
        // config.resolve.extensions.add('.js').add('.vue').add(".json").add(".ts")
      },
      chainWebpackRendererProcess: config => {
        config.plugin('define').tap(args => {
          args[0].IS_ELECTRON = true
          return args
        })
        config.resolve.alias.set('@', resolve('src/renderer'))
      },
      outputDir: 'dist/electron',
      mainProcessFile: 'src/main/main.js',
      mainProcessWatch: ['src/main']
    }
  }
}
