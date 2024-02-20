/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
import { Env } from './env';

/**
 * 判断一个值是否为boolean
 *
 * @param value 要判断的值
 * @returns 如果值为 `boolean` 类型，则返回 `true`；否则返回 `false`。
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

// 字符串转数组（包括字符串内含表情）
export const strToArr = (val: string, start?: number, limit?: number) => {
  const rsAstralRange = '\\ud800-\\udfff';
  const rsZWJ = '\\u200d';
  const rsVarRange = '\\ufe0e\\ufe0f';
  const rsComboMarksRange = '\\u0300-\\u036f';
  const reComboHalfMarksRange = '\\ufe20-\\ufe2f';
  const rsComboSymbolsRange = '\\u20d0-\\u20ff';
  const rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
  // eslint-disable-next-line no-misleading-character-class
  const reHasUnicode = RegExp(`[${rsZWJ}${rsAstralRange}${rsComboRange}${rsVarRange}]`);

  const rsFitz = '\\ud83c[\\udffb-\\udfff]';
  const rsOptVar = `[${rsVarRange}]?`;
  const rsCombo = `[${rsComboRange}]`;
  const rsModifier = `(?:${rsCombo}|${rsFitz})`;
  const reOptMod = `${rsModifier}?`;
  const rsAstral = `[${rsAstralRange}]`;
  const rsNonAstral = `[^${rsAstralRange}]`;
  const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
  const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
  const rsOptJoin = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join('|')})${rsOptVar}${reOptMod})*`;
  const rsSeq = rsOptVar + reOptMod + rsOptJoin;
  const rsSymbol = `(?:${[`${rsNonAstral + rsCombo}?`, rsCombo, rsRegional, rsSurrPair, rsAstral].join('|')})`;
  const reUnicode = RegExp(`${rsFitz}(?=${rsFitz})|${rsSymbol}${rsSeq}`, 'g');

  const toArray = (val: string) => {
    // 字符串转成数组
    return hasUnicode(val) ? unicodeToArray(val) : asciiToArray(val);
  };

  const hasUnicode = (val: string) => {
    return reHasUnicode.test(val);
  };

  const unicodeToArray = (val: string) => {
    return val.match(reUnicode) || [];
  };

  const asciiToArray = (val: string) => {
    return val.split('');
  };

  const strarr = toArray(val);
  return strarr.slice(start, limit);
};

/**
 * 二次确认弹框
 * @param param0
 * @returns
 */
export const confirm = ({
  title = '提示',
  cancelColor = '#333333',
  confirmColor = '#576B95',
  content = '',
  cancelText = '取消',
  confirmText = '确定',
  showCancel = true,
  ...option
} = {}) => {
  return new Promise((resolve, reject) => {
    Env.showModal({
      title,
      cancelColor,
      confirmColor,
      content,
      cancelText,
      confirmText,
      showCancel,
      ...option,
      success(res) {
        if (res.confirm) {
          resolve(res.errMsg);
        } else if (res.cancel) {
          reject(res.errMsg);
        }
      },
      fail: reject,
    });
  });
};

/**
 * 授权并保存到相册
 * @param {string} url 图片/视频文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径
 * @param {boolean} showLoading 是否显示loading
 * @param {boolean} showToast 是否显示保存成功toast
 * @param {string} type 保存的文件类型，image / video
 * @return promise
 * */
export const saveToAlbumWithAuthorize = (
  url: string,
  showLoading = true,
  showToast = true,
  type: 'image' | 'video' = 'image',
) => {
  return new Promise<void>((resolve, reject) => {
    const failDeal = async () => {
      try {
        await saveToAlbum(url, showLoading, showToast, type);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    Env.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          confirm({
            title: '是否保存到相册？',
            content: '获取相册授权才能保存，请到小程序设置中打开授权',
            showCancel: false,
          }).then(() => {
            Env.openSetting();
          });
          resolve();
        } else {
          failDeal();
        }
      },
      fail: () => {
        failDeal();
      },
    });
  });
};

/**
 * 判断是否是pc
 * @returns {boolean}
 */
export const isPc = () => {
  const platform = Env.getSystemInfoSync()!.platform;
  if (platform === 'mac' || platform === 'windows') {
    return true;
  }
  return false;
};

// 下载文件
export const downloadFile = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    Env.downloadFile({
      url,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: reject,
    });
  });
};

const saveAPIMap = {
  image: Env.saveImageToPhotosAlbum,
  video: Env.saveVideoToPhotosAlbum,
  pc: Env.saveFileToDisk,
};
// 保存图片或视频到相册 type: image / video
const saveToAlbum = async (
  url: string,
  showLoading = true,
  showToast = true,
  type: keyof typeof saveAPIMap = 'image',
) => {
  if (/http(s)/.test(url)) {
    url = await downloadFile(url);
  }
  if (isPc()) {
    type = 'pc';
  }
  return new Promise<void>((resolve, reject) => {
    showLoading && Env.showLoading({ title: '保存中' });
    saveAPIMap[type]({
      filePath: url,
      success() {
        Env.hideLoading();
        showToast && Env.showToast({ icon: 'none', title: '保存成功' });
        resolve();
      },
      fail() {
        Env.hideLoading();
        Env.showToast({ icon: 'none', title: '保存失败' });
        reject();
      },
    });
  });
};

export const toType = (obj: any) => {
  let _a;
  return (_a = Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)) == null ? void 0 : _a[1].toLowerCase();
};

/**
 * 将网络图片地址转为本地地址
 * @param {string} src 图片网络路径
 */
export const getImgLocalPath = (src: string) => {
  return new Promise<string>((resolve, reject) => {
    src &&
      Env.getImageInfo({
        src,
        success(res) {
          resolve(res.path);
        },
        fail(err) {
          reject(err);
        },
      });
  });
};
