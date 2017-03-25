# vue2.0-multi-page

### 参考UI框架

### 适合PC UI

* <a href="http://www.iviewui.com/">ivew</a> 

* <a href="http://okoala.github.io/">Antd</a>

* <a href="http://museui.github.io/">Muse-UI</a>

> 了解了Vue一般都会去用Vue-cli入门，这是一个构建SPA的脚手架，查看其build的项目，可以看到它是将所有的模块都输出到一个build.js中，有时候会看到这个js文件特别大，有好几兆，然而当一个项目足够复杂时，SPA恐怕不再适合使用了，用户不可能访问你的网页的时候一下子下载一个几兆的文件，特别对于手机用户，可能用户只看了网站中的一篇文章，这也会导致网页加载慢，这是不可取的。所以应该将网站划分成若干模块。 
参考[https://github.com/jarvan4dev/vue-multi-page] 这个使用的是Vue1.0 因为2.0和1.0相比差距比较大，所以修改为Vue2.0

## 如何开始？
> 假设你已经熟悉了vue-cli了😄

1. 创建项目
	
	```bash
	vue init webpack vue-multi-page
	# 为了简便可以不用jslint等
	```
2. 开始改造
	> 最主要的一步，将webpack进行改造以满足对多页面需求的支持，其实多页面，即是webpack有多个入口。在此步中，我们主要的操作的对象是 build文件夹下的js文件。

	+ 首先，我们对 utils.js进行改造
		添加一个方法：getEntries，方法中需要使用到node的globa模块，所以需要引入 
		
		```
  		// glob模块，用于读取webpack入口目录文件
      // 看到issue中有人问glob模块，这个是需要npm安装的，[https://github.com/isaacs/node-glob](https://github.com/isaacs/node-glob)
      var glob = require('glob');
    ```
		
		```javascript
		exports.getEntries = function (globPath) {
      var entries = {}
      /**
       * 读取src目录,并进行路径裁剪
       */
      glob.sync(globPath).forEach(function (entry) {
        /**
         * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
         * path.extname 获取文件后缀
         */
        var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
        // ***************begin***************
        // 当然， 你也可以加上模块名称, 即输出如下： { module/main: './src/module/index/main.js', module/test: './src/module/test/test.js' }
        // 最终编译输出的文件也在module目录下， 访问路径需要时 localhost:8080/module/index.html
        // slice 从已有的数组中返回选定的元素, -3 倒序选择，即选择最后三个
        // var tmp = entry.split('/').splice(-3)
        // var pathname = tmp.splice(0, 1) + '/' + basename; // splice(0, 1)取tmp数组中第一个元素
        // console.log(pathname)
        // entries[pathname] = entry
        // ***************end***************
        entries[basename] = entry
      });
      // console.log(entries);
      // 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/test.js' }
      return entries;
    }
		```
	+ 其次，对webpack.base.conf.js进行改造
		
		删除 ~~entry: {app: './src/main.js'},~~，取而代之如下：

		```javascript
  		module.exports = {
  			···
  			entry: utils.getEntries('./src/module/**/*.js'),
  		  ···
  		}
		```
	+ 最后改造webpack.dev.conf.js和webpack.prod.conf.js
		
		移除原来的HtmlWebpackPlugin
		
		```javascript
		  var pages = utils.getEntries('./src/module/**/*.html')
      for(var page in pages) {
        // 配置生成的html文件，定义路径等
        var conf = {
          filename: page + '.html',
          template: pages[page], //模板路径
          inject: true,
          // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
          // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
          // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
          // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
          excludeChunks: Object.keys(pages).filter(item => {
            return (item != page)
          })
        }
        // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
        module.exports.plugins.push(new HtmlWebpackPlugin(conf))
      }
		```
		
## 构建步骤

		``` bash
		# 安装依赖
		npm install
		# 本地测试
		npm run dev
		# 打包
		npm run build
		
		```
		
在本地调试启动后访问：[index(http://localhost:8080)](http://localhost:8080) | [about(http://localhost:8080/about.html)](http://localhost:8080/about.html) 即可
