import { Env } from './env';

import defaultOptions from './defaultOptions';
import { DrawImageOptions, DrawOptions, DrawRectOptions, DrawTextOptions } from './types';
import { saveToAlbumWithAuthorize, strToArr } from './utils';
import log from './log';
type DrawnImageOption = Required<DrawImageOptions> & {
  img: string;
  type: 'image';
};
interface CanvasConfig {
  dpr?: number;
}

export class CanvasDraw {
  query: WechatMiniprogram.SelectorQuery;
  canvasDomId: any;
  options: (DrawOptions | DrawnImageOption)[];
  _this: any;
  canvas: any;
  ctx: any;
  config?: CanvasConfig;

  /** 白屏检测 */
  static async isAllWhite(imagePath: string) {
    const width = 30;
    const height = 30;
    const canvas = Env.createOffscreenCanvas({
      type: '2d',
      width,
      height,
    });

    const context = canvas.getContext('2d') as any;

    // 创建一个图片
    const image = canvas.createImage();
    // 等待图片加载
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imagePath; // 要加载的图片 url
    });

    context.drawImage(image, 0, 0, width, height);

    const line1Data = context.getImageData(0, height / 2, width, 1).data;
    const line2Data = context.getImageData(width / 2, 0, height, 1).data;
    const len1 = line1Data.length;
    const len2 = line2Data.length;
    for (let i = 0; i < len1 + len2; i += 4) {
      const imageData = i < len1 ? line1Data : line2Data;
      const ind = i < len1 ? i : i - len1;
      const pixelSum = imageData[ind] + imageData[ind + 1] + imageData[ind + 2] + imageData[ind + 3];
      if (pixelSum !== 1020 && pixelSum !== 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param canvasDomId canvas元素id
   * @param options 画图配置列表
   * @param config dpr 配置
   * @param _this 自定义组件的this（将选择器的选取范围更改为自定义组件内）
   *
   */
  constructor(canvasDomId: string, options: DrawOptions[] = [], config?: CanvasConfig, _this?: any) {
    this.canvasDomId = canvasDomId;
    this.options = options.filter((n) => n) || [];
    this._this = _this;
    this.config = config;
    if (_this) {
      this.query = Env.createSelectorQuery().in(_this);
    } else {
      this.query = Env.createSelectorQuery();
    }
  }

  /* 绘制canvas */
  async drawCanvas() {
    try {
      await this.init();
      await this.processOptions();
      this.draw();
    } catch (error) {
      log.error('Draw_Api_Error', {
        func: 'drawCanvas',
        error,
        system: Env.getSystemInfoSync(),
        drawOptions: this.options,
      });
      console.error('drawCanvas失败：', error);
      return Promise.reject();
    }
  }

  /**
   * 绘制canvas 并生成图片
   *
   * @param option 生成图片配置
   * @param option.isSave 是否保存相册
   * @param option.needWhiteScreenDetection 是否需要白屏检测（防止PC端输出的图片是白屏）
   *
   * @return promise (tempFilePath)
   *  */
  async drawCanvasToImage(
    option: {
      /** 图片类型 默认 jpg。 */
      fileType?: 'jpg' | 'png';
      /** 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。 */
      quality?: number;
      /** 是否保存到相册 */
      isSave?: boolean;
      /** 是否需要白屏检测，防止 PC 端导出图片为白屏的情况。白屏检测验证十字线区域是否为白色，检测到到十字线全为白色时，重新生成图片。 */
      needWhiteScreenDetection?: boolean;
    } = {
      isSave: false,
      needWhiteScreenDetection: false,
    },
  ) {
    try {
      const { fileType = 'jpg', quality = 1, isSave, needWhiteScreenDetection } = option as any;
      await this.drawCanvas();
      return new Promise((resolve, reject) => {
        const getImageFilePath = (): Promise<string> =>
          new Promise((resolve) => {
            Env.canvasToTempFilePath(
              {
                x: 0,
                y: 0,
                quality,
                width: this.canvas.width,
                height: this.canvas.height,
                destWidth: this.canvas.width,
                destHeight: this.canvas.height,
                fileType,
                canvas: this.canvas,
                success: async (res) => {
                  resolve(res.tempFilePath);
                },
                fail: function (err) {
                  console.error('canvasToTempFilePath', err);
                  reject({ msg: '图片转换失败' });
                },
              },
              this._this,
            );
          });

        const imageFind = (t: number) => {
          return setTimeout(async () => {
            const tmpPath = await getImageFilePath();
            const res = needWhiteScreenDetection ? await CanvasDraw.isAllWhite(tmpPath) : false;
            if (res) {
              // t为420时已经经过了3s
              if (t < 420) {
                timer = imageFind(t + 30);
              } else {
                reject();
                log.warn('Draw_Api_TimeOut', {
                  func: 'drawCanvasToImage',
                  system: Env.getSystemInfoSync(),
                  drawOptions: this.options,
                });
              }
            } else {
              clearTimeout(timer);
              resolve(tmpPath);
              if (isSave && tmpPath) saveToAlbumWithAuthorize(tmpPath);
            }
          }, t);
        };
        let timer = imageFind(0);
      }) as Promise<string>;
    } catch (error) {
      log.error('Draw_Api_Error', {
        func: 'drawCanvasToImage',
        error: String(error),
        system: Env.getSystemInfoSync(),
        drawOptions: this.options,
      });
    }
  }

  // 画图初始化
  init() {
    return new Promise<void>((resolve, reject) => {
      const nodesRef =
        typeof this.canvasDomId === 'function' ? this.canvasDomId() : this.query.select(this.canvasDomId);
      nodesRef
        .fields(
          {
            id: true,
            node: true,
            size: true,
          },
          (nodeRef: any) => {
            if (!nodeRef) return reject('');
            this.canvas = nodeRef.node;
            this.ctx = this.canvas.getContext('2d');

            if (this.config?.dpr) {
              const systemDpr = Env.getSystemInfoSync().pixelRatio;
              const dpr = this.config.dpr! * systemDpr;
              this.canvas.width = nodeRef.width * systemDpr;
              this.canvas.height = nodeRef.height * systemDpr;
              this.ctx.scale(dpr, dpr);
            } else {
              const dpr = Env.getSystemInfoSync().pixelRatio;

              // 新接口需显示设置画布宽高；
              this.canvas.width = nodeRef.width * dpr;
              this.canvas.height = nodeRef.height * dpr;
              this.ctx.scale(dpr, dpr);
            }
            resolve();
          },
        )
        .exec();
    });
  }

  // 处理画图元素数据
  async processOptions() {
    try {
      const imgPromises: PromiseLike<any>[] = [];
      this.options = this.options.map((option) => {
        const defaultOption = defaultOptions[option.type as keyof typeof defaultOptions];
        const combineOption: DrawOptions = { ...defaultOption, ...option };
        switch (combineOption.type) {
          case 'text':
            (combineOption as DrawTextOptions).content = combineOption?.content?.replace(
              /([↵]+)|([\n]+)|([\r]+)/g,
              ' ',
            );
            break;
          case 'image':
            if (!(combineOption as unknown as DrawnImageOption).url) {
              console.error(`绘制图片的url不能为空`);
              return;
            }
            if (!(combineOption as unknown as DrawnImageOption).img) {
              imgPromises.push(this.covtImageToImageData(combineOption));
            }
            break;
          default:
            break;
        }
        return combineOption as any;
      });
      if (imgPromises.length > 0) {
        return await Promise.all(imgPromises);
      }
    } catch (error) {
      throw { func: 'processOptions', error };
    }
  }

  // 转化图片连接到图片数据
  covtImageToImageData(option: Record<string, any>) {
    return new Promise((resolve, reject) => {
      const img = this.canvas.createImage(); // 创建img对象
      img.src = option.url;
      img.onload = () => {
        option.img = img;
        resolve(option);
      };
      img.onerror = (err: any) => {
        reject(err);
      };
    });
  }

  // 绘制
  draw() {
    this.options.forEach((option) => {
      switch (option.type) {
        case 'text':
          this.drawText(option as Required<DrawTextOptions>);
          break;
        case 'image':
          this.drawImage(option as Required<DrawnImageOption>);
          break;
        case 'rect':
          this.drawRect(option as Required<DrawRectOptions>);
          break;
        default:
          break;
      }
    });
  }

  // 画文本
  drawText(option: Required<DrawTextOptions>) {
    this.ctx.beginPath();
    this.ctx.fillStyle = option.fillStyle;
    this.ctx.font = option.font;
    this.ctx.textAlign = option.align;
    this.ctx.textBaseline = option.baseline;
    if (option.fontKerning) this.ctx.fontKerning = option.fontKerning;
    if (option.fontStretch) this.ctx.fontStretch = option.fontStretch;
    if (option.direction) this.ctx.direction = option.direction;
    if (option.fontVariantCaps) this.ctx.fontVariantCaps = option.fontVariantCaps;
    if (option.textRendering) this.ctx.textRendering = option.textRendering;
    if (typeof option?.wordSpacing === 'number') {
      this.ctx.wordSpacing = `${option.wordSpacing}px`;
    }
    const arrText = strToArr(option.content);
    const metrics = this.ctx.measureText(option.content.slice(0, 5));
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const lineHeight = option.lineHeight || textHeight * 1.4;
    // 文字顶部的行高空间
    const topSpace = (lineHeight - textHeight) / 2;
    // 文字溢出处理
    let row = 1;
    let line = '';
    let textTop = option.y + topSpace;
    for (let n = 0; n < arrText.length; n++) {
      const testLine = line + arrText[n];
      const metrics = this.ctx.measureText(testLine);
      if (metrics.width > option.maxWidth && n > 0) {
        if (row === Number(option.rowCount)) {
          line = `${strToArr(line, 0, strToArr(line).length - 1).join('')}...`;
          this.fillTextDecoration({ option, text: line, textTop, lineHeight, topSpace });
          break;
        }
        this.fillTextDecoration({ option, text: line, textTop, lineHeight, topSpace });
        line = arrText[n];
        textTop += lineHeight;
        row += 1;
      } else {
        line = testLine;
      }
    }
    this.fillTextDecoration({ option, text: line, textTop, lineHeight, topSpace });
  }

  // 画文字装饰
  fillTextDecoration({
    text,
    option,
    textTop,
    lineHeight,
    topSpace,
  }: {
    option: Required<DrawTextOptions>;
    text: string;
    textTop: number;
    lineHeight: number;
    topSpace: number;
  }) {
    this.ctx.fillText(text, option.x, textTop);
    switch (option.textDecoration) {
      case 'line-through': {
        const y = textTop + lineHeight / 2 - topSpace;
        this.ctx.moveTo(option.x - 2, y);
        this.ctx.lineTo(option.x + 2 + this.ctx.measureText(text).width, y);
        this.ctx.lineWidth = '1';
        this.ctx.strokeStyle = option.fillStyle;
        this.ctx.stroke();
        break;
      }
      default:
        break;
    }
  }

  // 画图片
  drawImage(option: Required<DrawnImageOption>) {
    const x = option.x;
    const y = option.y;
    const w = option.width;
    const h = option.height;
    const r = option.radius;
    if (r) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      this.ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      this.ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
      this.ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
      this.ctx.clip();
      this.ctx.drawImage(option.img, x, y, w, h);
      this.ctx.restore();
      return;
    }
    this.ctx.beginPath();
    this.ctx.drawImage(option.img, x, y, w, h);
  }

  // 画矩形
  drawRect(option: Required<DrawRectOptions>) {
    this.ctx.beginPath();
    this.ctx.lineWidth = option.lineWidth;
    this.ctx.fillStyle = option.fillStyle;
    this.ctx.strokeStyle = option.strokeStyle;
    const x = option.x;
    const y = option.y;
    const w = option.width;
    const h = option.height;
    const r = option.radius;
    if (r) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      this.ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      this.ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
      this.ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
      this.ctx.clip();
    }
    this.ctx.rect(x, y, w, h);
    if (option.mode === 'both') {
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx[option.mode]();
    }
    this.ctx.restore();
  }
}
