# @fx-front/mini-canvas-tools

小程序 canvas 画图工具，支持以配置方式画图。

目前支持：微信小程序、Taro。

## 安装

```bash
npm install @fx-front/mini-canvas-tools
```

> 提示：微信小程序安装完成后，需要进行构建npm操作。

## 使用

### 微信小程序

wxml:

```html
<canvas type="2d" id="poster-canvas" style="width: 375px; height: 375px" />
```

js:

```js
import { CanvasDraw, saveToAlbumWithAuthorize, DrawOptions } from '@fx-front/mini-canvas-tools';

Page({
  data: {
    posterUrl: '',
  },

  // 画图
  drawCanvas() {
    // 画图配置（使用类型注释以获得类型提示）
    /** @type {DrawOptions[]} */
    const config = [
      {
        type: 'rect',
        x: 0,
        y: 0,
        width: 375,
        height: 375,
        name: 'rect-0',
        fillStyle: '#66ccff',
        mode: 'fill',
        radius: 10,
      },
      {
        type: 'text',
        x: 50,
        y: 120,
        name: 'text-0',
        content: '这是一段文本',
        font: 'normal 500 14px PingFang-SC-Medium',
        fillStyle: '#333',
        maxWidth: 240,
      },
    ];
    const posterDraw = new CanvasDraw('#poster-canvas', config);
    this.posterUrl = await posterDraw.drawCanvasToImage();
  },

  // 保存图片
  save() {
    this.data.posterUrl && saveToAlbumWithAuthorize(this.data.posterUrl);
  }
});
```

### Taro

```tsx
import { CanvasDraw, DrawOptions } from '@fx-front/mini-canvas-tools';

export default function Home() {
  // 图片路径
  const [url, setUrl] = useState('');

  useEffect(() => {
    setTimeout(() => {
      draw();
    }, 2000);
  }, []);

  // 画图
  const draw = async () => {
    // 画图配置
    const config: DrawOptions[] = [
      {
        type: 'rect',
        x: 0,
        y: 0,
        width: 375,
        height: 375,
        name: 'rect-0',
        fillStyle: '#66ccff',
        mode: 'fill',
        radius: 10,
      },
      {
        type: 'text',
        x: 50,
        y: 120,
        name: 'text-0',
        content: '这是一段文本',
        font: 'normal 500 14px PingFang-SC-Medium',
        fillStyle: '#333',
        maxWidth: 240,
      },
    ];
    const draw = new CanvasDraw('#card-canvas', config);
    const url = await draw.drawCanvasToImage();
    url && setUrl(url);
  };

  // 保存图片
  const handleSave = () => {
    url && saveToAlbumWithAuthorize(url);
  };
  return (
    <View>
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: '-9999px',
          width: 375,
          height: 375,
        }}
        id="card-canvas"
        canvasId="card-canvas"
        type="2d"
      />
      <Image className="block w-full" src={url} mode="widthFix" />
      <GButton type="primary" className="mt-10 block" onClick={handleSave}>
        保存到相册
      </GButton>
    </View>
  );
}
```

## 画图配置

通过向 `CanvasDraw` 构造函数第二个参数传入一个配置数组，可以配置画图的内容。

目前支持的配置类型：

- `text`：文本
- `image`：图片
- `rect`：矩形

`text` 配置类型：

```ts
export interface DrawTextOptions {
  /**
   * 类型。
   */
  type: 'text';
  /**
   * 文本的水平对齐方式。
   * @default 'left'
   */
  align?: 'left' | 'right' | 'center';
  /**
   * 画笔透明度。范围：0-1。
   * @default 1
   */
  alpha?: number;
  /**
   * 文本的竖直对齐方式。
   * @default 'top'
   */
  baseline?: 'normal' | 'top' | 'middle' | 'bottom';
  /**
   * 要绘制的文本。
   * @default ''
   */
  content?: string;
  /**
   * 字体颜色。
   * @default '#111'
   */
  fillStyle?: string;
  /**
   * 字体大小、样式、粗细、字体。
   * @default 'normal 400 14px PingFangSC-Regular'
   */
  font?: string;
  /**
   * 字体行高。
   * @default 14 * 1.4
   */
  lineHeight?: number;
  /**
   * 需要绘制的最大宽度。
   * @default 375
   */
  maxWidth?: number;
  /**
   * 名称。
   * @default '未说明'
   */
  name?: string;
  /**
   * 文字行数。
   * @default 1
   */
  rowCount?: number;
  /**
   * 文本装饰。
   *
   * line-through: 删除线
   */
  textDecoration?: 'line-through' | '';
  /**
   * 绘制左上角 x 坐标位置。
   * @default 0
   */
  x: number;
  /**
   * 绘制左上角 y 坐标位置。
   * @default 0
   */
  y: number;
  /**
   * 文本方向。
   * @default 'inherit'
   */
  direction?: 'inherit' | 'ltr' | 'rtl';
  /**
   * 字体间距。
   * @default 'normal'
   */
  fontKerning?: 'auto' | 'none' | 'normal';
  /**
   * 字体拉伸。
   * @default 'normal'
   */
  fontStretch?:
    | 'condensed'
    | 'expanded'
    | 'extra-condensed'
    | 'extra-expanded'
    | 'normal'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'ultra-condensed'
    | 'ultra-expanded';
  /**
   * 字体变种。
   * @default 'normal'
   */
  fontVariantCaps?:
    | 'all-petite-caps'
    | 'all-small-caps'
    | 'normal'
    | 'petite-caps'
    | 'small-caps'
    | 'titling-caps'
    | 'unicase';
  /**
   * 渲染文本的方式
   * @default 'auto'
   */
  textRendering?: 'auto' | 'geometricPrecision' | 'optimizeLegibility' | 'optimizeSpeed';
  /**
   * 绘制文本时单词之间的间距。
   * @default 0
   */
  wordSpacing?: number;
}
```

`image` 配置类型：

```ts
export interface DrawImageOptions {
  /**
   * 类型。
   */
  type: 'image';
  /**
   * 图片高度。
   * @default 300
   */
  height?: number;
  /**
   * 图片名称。
   * @default '未说明'
   */
  name?: string;
  /**
   * 图片圆角半径。
   * @default 0
   */
  radius?: number;
  /**
   * 图片链接。
   * @default ''
   */
  url?: string;
  /**
   * 图片宽度。
   * @default 300
   */
  width?: number;
  /**
   * 绘制左上角 x 坐标位置。
   * @default 0
   */
  x: number;
  /**
   * 绘制左上角 y 坐标位置。
   * @default 0
   */
  y: number;
}
```

`rect` 配置类型：

```ts
export interface DrawRectOptions {
  /**
   * 类型。
   */
  type: 'rect';
  /**
   * 填充颜色。
   * @default '#fff'
   */
  fillStyle?: string;
  /**
   * 矩形路径的高度。
   * @default 100
   */
  height?: number;
  /**
   * 线条的宽度，单位 px。
   * @default 1
   */
  lineWidth?: number;
  /**
   * 填充方式。
   *
   * stroke: 填充边框 fill: 填充内容 both: 同时填充边框和内容
   * @default 'fill'
   */
  mode?: 'stroke' | 'fill' | 'both';
  /**
   * 边框颜色。
   * @default '#fff'
   */
  strokeStyle?: string;
  /**
   * 矩形路径的宽度。
   * @default 100
   */
  width?: number;
  /**
   * 矩形路径左上角的横坐标。
   * @default 0
   */
  x: number;
  /**
   * 矩形路径左上角的纵坐标。
   * @default 0
   */
  y: number;
  /**
   * 名称。
   * @default '未说明'
   */
  name?: string;
  /**
   * 圆角半径。
   * @default 0
   */
  radius?: number;
}
```
