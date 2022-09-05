import { Runner } from '@paddlejs/paddlejs-core';
import { glInstance } from '../../src/index';

const opName = 'slice';
const modelDir = '/test/op/data/';
const modelPath = `${modelDir}${opName}.json`;


async function run() {
    const runner = new Runner({
        modelPath,
        feedShape: {
            fw: 3,
            fh: 3
        },
        needPreheat: false
    });
    await runner.init();
    const executeOP = runner.weightMap[1];
    runner.executeOp(executeOP);
    const res = await glInstance.read();
    console.log(res);
}

run();
