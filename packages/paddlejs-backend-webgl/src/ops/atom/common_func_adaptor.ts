import { env } from '@paddlejs/paddlejs-core';

export function calMod() {
    return env.get('useModAdaptor')
        ? `
            int calMod(int a, int b) {
                float modV = mod(float(a), float(b));
                if (modV == float(b)) {
                    modV = 0.0;
                }
                return int(modV);
            }
        `
        : `
            int calMod(int a, int b) {
                return a - a / b * b;
            }
        `;
}

export function calDivision() {
    return env.get('useDivisionAdaptor')
        ? `
            int calDivision(int a, int b) {
                return int(float(a) / (float(b) - 0.0001));
            }
        `
        : `
            int calDivision(int a, int b) {
                return a / b;
            }
        `;
}

export function calTanh() {
    return `
    float tanh_calc(float num) {
        float res = (exp(2.0 * num) - 1.0) / (exp(2.0 * num) + 1.0);
        return res;
    }
    `;
}

export function adapterFunctions() {
    return `
    ${calMod()}
    ${calDivision()}
    ${calTanh()}
    `;
}
