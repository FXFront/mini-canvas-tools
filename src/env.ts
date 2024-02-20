const isWx = typeof wx === 'object' && typeof wx.getSystemInfoSync === 'function';

// @ts-ignore
const isTaro = typeof Taro === 'object' && typeof Taro.getSystemInfoSync === 'function';

let Env: WechatMiniprogram.Wx;

if (isWx) Env = wx;

// @ts-ignore
if (isTaro) Env = Taro;

export { Env };
