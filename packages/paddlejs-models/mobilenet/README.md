[中文版](./README_cn.md)

# mobilenet

mobilenet model can classify img. It provides simple interfaces to use. You can use your own category model to classify img.

<img src="https://img.shields.io/npm/v/@paddlejs-models/mobilenet?color=success" alt="version"> <img src="https://img.shields.io/bundlephobia/min/@paddlejs-models/mobilenet" alt="size"> <img src="https://img.shields.io/npm/dm/@paddlejs-models/mobilenet?color=orange" alt="downloads"> <img src="https://img.shields.io/npm/dt/@paddlejs-models/mobilenet" alt="downloads">

# Run Demo
1. Execute in the current directory
``` bash
npm install
npm run dev
```
2. Visit http://0.0.0.0:8867

# Usage

```js

import * as mobilenet from '@paddlejs-models/mobilenet';

// You need to specify your model path and the binary file count
// If your has mean and std params, you need to specify them.
// map is the results your model can classify.
await mobilenet.load({
    path,
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225]
}, map);

// get the result the mobilenet model classified.
const res = await mobilenet.classify(img);

```

# Online experience

mobileNet：https://paddlejs.baidu.com/mobilenet

wine：https://paddlejs.baidu.com/wine

# Performance
<img alt="image" src="https://user-images.githubusercontent.com/43414102/156393394-ab1c9e4d-2960-4fcd-ba22-2072fa9b0e9d.png">
