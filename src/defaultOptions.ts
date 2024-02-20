import { DrawOptions } from './types';

import { DrawType } from './types';

// 小程序画canvas元素各类型默认数据
export const defaultOptions: {
  [k in DrawType]: DrawOptions;
} = {
  text: {
    type: 'text',
    align: 'left', // 文字的水平对齐 left/right/center
    alpha: 1, // 画笔透明度 范围 0-1
    baseline: 'normal', // 文字的竖直对齐方式 top/middle/bottom
    content: '', // 要绘制的文本
    fillStyle: '#111', // 字体颜色
    font: 'normal 400 14px PingFangSC-Regular', // 字体大小 style weight size family
    lineHeight: 14 * 1.4, // 字体行高
    maxWidth: 375, // 需要绘制的最大宽度
    name: '未说明',
    rowCount: 1, // 文字行数
    textDecoration: '', // 文本装饰
    x: 0, // 绘制左上角 x 坐标位置
    y: 0, // 绘制左上角 y 坐标位置
  },
  image: {
    type: 'image',
    height: 300, // 图片高度
    name: '未说明',
    radius: 0, // 图片圆角
    url: '', // 图片链接
    width: 300, // 图片宽度
    x: 0, // 绘制左上角 x 坐标位置
    y: 0, // 绘制左上角 y 坐标位置
  },
  rect: {
    type: 'rect',
    fillStyle: '#fff', // 设置填充色
    name: '未说明',
    height: 100, // 矩形路径的高度
    lineWidth: 1, // 线条的宽度，单位px
    mode: 'fill', // 绘制方式 strock/fill/both
    strokeStyle: '#fff', // 描边颜色
    width: 100, // 矩形路径的宽度
    x: 0, // 矩形路径左上角的横坐标
    y: 0, // 矩形路径左上角的纵坐标
    radius: 0, // 图片圆角
  },
};

export default defaultOptions;
