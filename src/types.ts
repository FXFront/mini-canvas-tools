/** 绘制类型 */
export type DrawType = 'text' | 'image' | 'rect';

/**
 * 绘制文本的选项。
 */
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

/**
 * 绘制图片的选项。
 */
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

/**
 * 绘制矩形的选项。
 */
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

/**
 * 绘制选项
 */
export type DrawOptions = DrawImageOptions | DrawTextOptions | DrawRectOptions;
