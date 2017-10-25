标注：
本文问题部分解决问题的方案参考自
http://blog.csdn.net/u014695532/article/details/52830545
http://blog.csdn.net/binggoogle/article/details/53105328

本文代码学习自
http://www.imooc.com/learn/868

## start

安装项目依赖文件包

> `cnpm install` or `npm install`

启动项目服务

> `cnpm start` or `npm start`

打包项目

> `cnpm build` or `npm build`

## changelog

- 1、[update npm packages](#update-npm-packages)
- 2、[define components](#define-components)

### update npm packages

> ` cnpm install npm-check -g ` 全局安装 ` npm ` 依赖包检查工具

> 进入项目目录环境，执行 ` npm-check -u ` 检查项目依赖包文件的状态，会列出所有依赖包的当前安装版本和最新版本的信息，接下来开发者可以按上下键选择要更新的包栏目，按空格键选中，选中完成后按回车键执行 ` npm ` 依赖包安装。

> 注意：上面的更新操作只是更新了 ` package.json ` 里面的包的配置信息，` node_modules ` 里面还是需要开发者手动删除，然后执行 ` npm install ` 或者 ` cnpm install ` 命令安装依赖包文件。

```javascript
? Choose which packages to update. (Press <space> to select)
  
 Major Update Potentially breaking API changes. Use caution.
 ◯ react                                ^16.0.0  ❯  16.0.0  https://facebook.github.io/react/
 ◯ react-dom                            ^16.0.0  ❯  16.0.0  https://facebook.github.io/react/
 ◯ react-router                         ^4.2.0   ❯  4.2.0   https://github.com/ReactTraining/react-router#readme
 ◯ autoprefixer devDep                  ^7.1.5   ❯  7.1.5   https://github.com/postcss/autoprefixer#readme
 ◯ babel-loader devDep                  ^7.1.2   ❯  7.1.2   https://github.com/babel/babel-loader
 ◯ babel-plugin-react-transform devDep  ^3.0.0   ❯  3.0.0   https://github.com/gaearon/babel-plugin-react-transform#readme
 ◯ extract-text-webpack-plugin devDep   ^3.0.1   ❯  3.0.1   http://github.com/webpack-contrib/extract-text-webpack-plugin
 ◯ less-loader devDep                   ^4.0.5   ❯  4.0.5   https://github.com/webpack-contrib/less-loader#readme
 ◯ webpack devDep                       ^3.7.1   ❯  3.7.1   https://github.com/webpack/webpack
 ◯ webpack-dev-server devDep            ^2.9.1   ❯  2.9.1   http://github.com/webpack/webpack-dev-server
 Non-Semver Versions less than 1.0.0, caution.
 ◯ css-loader devDep    ^0.28.7  ❯  0.28.7  https://github.com/webpack/css-loader#readme
 ◯ style-loader devDep  ^0.19.0  ❯  0.19.0  https://github.com/webpack/style-loader#readme
  
 Space to select. Enter to start upgrading. Control-C to cancel.
```

### define components

原视频作者采用的是如下定义组件的方式

```javascript
    let Progress = React.createClass({
        render() {
            return (
                <div className="components-progress">
                    <div className="progress"></div>
                </div>
            );
        }
    });
```

项目改进后的组件定义方案

```javascript
    class Progress extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            return (
                <div className="components-progress">
                    <div className="progress"></div>
                </div>
            )
        }
    }
```

由于这里修改了组件定义方案，关于在组件里面使用一些方法或属性时，也会相应的有所改动。

## problems and solutions

1、当组件热更新时，会报警告⚠️

> 原因是：发生在异步处理的情况下，例如事件或者异步请求的情况，这时在回调函数中调用`component`的`setState`方法时，可能会出现当前组件还没有mounted到dom中，此时调用该方法会报如下错误警告：

```
Warning: Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component. This is a no-op.
```

> 估计是你setState在异步的callback里执行，而这个时候由于你返回上一页，组件已经被unmount了。可以考虑在unmount的时候取消相关pendingRequest的回调，比如ajax请求的话，就abort掉。或者用isMounted183做下判断，不过根据文档，这个api可能日后被移除。

解决方案：在报警告的组件的`render` 方法里面的根`DOM`上设置一个 `ref` 标识，在`setState`方法前做一个`this.refs.play`判断即可

```javascript
componentDidMount(){
    if(this.refs.play){
        this.setState({
            //do something
        });
    }
}

render(){
    return (
        <div className="player-page" ref="play">
            <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
        </div>
    )
}
```

2、将`React.createClass( )` 换成 `React.Component( )`方式

原著中组件你定义的方式是

```javascript
    let Progress = React.createClass({
        getInitialState: function(){
            //some thing
        }
        render() {
            return (
                //some thing
            );
        }
    });
```
将该方法替换成`React.Component( )`写法，应该是

```javascript
    class Progress extends React.Component{
        getInitialState: function(){
            //some thing
        }
    }
```
但是运行代码发现控制台有 `warning`

```
Warning: getInitialState was defined on Progress, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?
```

关于[官网的描述如下](https://reactjs.org/docs/components-and-props.html)

```
The API (via ‘extends React.Component’) is similar to React.createClass with the exception of getInitialState. Instead of providing a separate getInitialState method, you set up your own state property in the constructor.
```

也就是说，当我们通过es6类的继承实现时去掉了getInitialState这个hook函数， 规定state的初始化要在constructor中声明。

```javascript
class Progress extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
}
```

Babel的Blog上还提到另外一种实现方法，即直接使用赋值语句：

```javascript
class Progress extends React.Component{
    constructor(props){
        super(props);
    }

    state = {};
}
```

## React-router @4

原著中 `Router` 配置使用的是 ` React-router 2.0.0 `。在 ` Root.js ` 里面定义了 ` App ` 和 ` Root ` 两个组件，在 ` App ` 组件里面

```javascript
render() {
    return (
        <div className="container">
            <Logo></Logo>
            {React.cloneElement(this.props.children, {musicList: this.state.musicList, currentMusitItem: this.state.currentMusitItem})}
        </div>
    );
}
```

在 ` Root ` 组件配置如下

```javascript
render() {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={PlayerPage}/>
                <Route path="/list" component={listPage} />
            </Route>
        </Router>
    );
}
```

在本项目中使用的是 ` react-router-dom ` 即 ` react-router @4.0 `,路由的配置就完全不一样了

```javascript
render(){
    const Home = () => (
        <Player 
            currentMusicItem={this.state.currentMusicItem}
        />
    );

    const List = () => (
        <MusicList
            currentMusicItem={this.state.currentMusicItem}
            musiclist={this.state.musiclist}
        />
    );

    return (
        <Router>
            <div>
                <Header/>

                <Route exact path="/" component={Home}/>
                <Route path="/list" component={List}/>
            </div>
        </Router>
    )
}
```