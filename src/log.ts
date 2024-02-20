
import { Env } from './env';

const logObj: WechatMiniprogram.RealtimeLogManager | null = Env.canIUse('getRealtimeLogManager') ? Env.getRealtimeLogManager() : null;

/**
 * 线上实时日志埋点
 */
export const log = {
  debug(...args: any[]) {
    if (!logObj) return;
    (logObj as any)?.debug.apply(logObj, args);
  },
  info(...args: any[]) {
    if (!logObj) return;
    logObj.info(...args);
  },
  warn(...args: any[]) {
    if (!logObj) return;
    logObj.warn(...args);
  },
  error(...args: any[]) {
    if (!logObj) return;
    logObj.error(...args);
  },
};

export default log;
