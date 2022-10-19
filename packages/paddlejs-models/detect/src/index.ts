/**
 * @file detect model
 */

import { Runner } from '@paddlejs/paddlejs-core';
import '@paddlejs/paddlejs-backend-webgl';

let detectRunner = null as Runner;

export const defaultConfig = {modelPath: 'https://paddlejs.bj.bcebos.com/models/fuse/detect/detect_fuse_activation/model.json', fill: '#fff', mean: [0.5, 0.5, 0.5], std: [0.5, 0.5, 0.5], keepRatio: false};

export async function init(Config) {

    detectRunner = new Runner({
        modelPath: Config.modelPath ? Config.modelPath : defaultConfig.modelPath,
        fill: Config.fill ? Config.fill : defaultConfig.fill,
        mean: Config.mean ? Config.mean : defaultConfig.mean,
        std: Config.std ? Config.std : defaultConfig.std,
        bgr: true,
        keepRatio: Config.keepRatio ? Config.keepRatio : defaultConfig.keepRatio,
        webglFeedProcess: true
    });

    await detectRunner.init();
}

export async function detect(image, boxThresh = 0.3) {
    const output = await detectRunner.predict(image);
    // 阈值
    const defaultThresh = 0.3;
    const thresh = boxThresh ? boxThresh : defaultThresh;
    return output.filter(item => item[1] > thresh);
}
