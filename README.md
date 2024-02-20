### canvas 画图工具 2d 版说明

#### 1. 通过 `Canvas.getContext('2d')` 接口可以获取 `CanvasRenderingContext2D` 对象，实现了 `HTML Canvas 2D Context` 定义的属性、方法。[参考链接](https://whatwg-cn.github.io/html/#the-canvas-element)

#### 2. 画图类型定义

```
a. 文字 text
b. 图片 image 支持 url v2.11.0后支持base64 Data URI
c. 矩形 rect
```

#### 3. 画图默认参数添加在 `defaultOptions.js` 文件

#### 4. 使用方式

```
  //------js文件------

  import CanvasDraw,{ saveToAlbumWithAuthorize, downloadFile } from '';
  const draw = new CanvasDraw('#canvas_box',options)
  // 只画canvas
  detailDraw.drawCanvas();

  // 画canvas 并生成图片
  detailDraw.drawCanvasToImage({fileType : 'png'}).then((url)=>{
    console.log(url)
  });

  // 画canvas 生成图片 并保存相册
  detailDraw.drawCanvasToImage(true)

  //保存图片到相册
  saveToAlbumWithAuthorize(url);

  //保存图片到相册
  saveToAlbumWithAuthorize(url);

  //下载文件
  downloadFile(url);
```

```
  //------ wxml文件 ------
  <canvas type="2d" id="canvas_box"></canvas>
```

#### 5. 注意事项

a. canvas `type`必须为`2d` 需要设置 `id` \
b. 小程序基础库版本`>2.9.0`\
c. Canvas 2D 支持 [同层渲染](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html#%E5%8E%9F%E7%94%9F%E7%BB%84%E4%BB%B6%E5%90%8C%E5%B1%82%E6%B8%B2%E6%9F%93)\
d. Canvas 2D 需要显式设置画布宽高，默认：`300*150`\
e. 避免设置过大的宽高，在安卓下会有 crash 的问题 \
f. 在工具上，原生组件是用 web 组件模拟的，因此很多情况并不能很好的还原真机的表现，建议开发者在使用到原生组件时尽量在`真机`上进行调试。\
g.请注意[原生组件使用限制](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html#%E5%8E%9F%E7%94%9F%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6)
