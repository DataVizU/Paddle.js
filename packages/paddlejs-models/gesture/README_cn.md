[English](./README.md)

# gesture

gesture 为手势识别模块，包括两个模型：gesture_detect和gesture_rec。gesture_detect模型识别图片中人物手掌区域，gesture_rec模型识别人物手势。模块提供的接口简单，使用者只需传入手势图片即可获得结果。

<img src="https://img.shields.io/npm/v/@paddlejs-models/gesture?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs-models/gesture" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs-models/gesture?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs-models/gesture" alt="downloads">

# 运行 Demo
1. 在当前目录下执行
``` bash
npm install
npm run dev
```
2. 访问 http://0.0.0.0:8865


# 使用

```js
import * as gesture from '@paddlejs-models/gesture';

// gesture_detect、gesture_rec模型加载
await gesture.load();

// 获取图片识别结果。结果包括：手掌框选坐标和识别结果
const res = await gesture.classify(img);

```

# 在线体验

https://paddlejs.baidu.com/gesture

# 效果
<img alt="gesture" src="https://user-images.githubusercontent.com/43414102/156379706-065a4f57-cc75-4457-857a-18619589492f.gif">


