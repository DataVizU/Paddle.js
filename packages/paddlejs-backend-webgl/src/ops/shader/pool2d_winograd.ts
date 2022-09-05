/**
 * @file pool2d_winograd
 */

function mainFunc(
    { origin, pool },
    { strides = [], paddings = [], type_pool }
) {
    const [stride_v = 1, stride_h = 1] = strides;
    const [padTop = 0, padLeft = 0] = paddings;
    const {
        height_shape,
        width_texture,
        height_texture,
        offset_y
    } = origin;

    return `

    float getValueFromTensorPosPacked_origin(int r, int g, int b, int a) {
        int y = b / 2;
        int yOffset = calMod(b, 2);
        int x = a / 2;
        int xOffset = calMod(a, 2);
        int height = ${height_shape} + ${offset_y};
        vec4 pixels = TEXTURE2D(
            texture_origin,
            vec2((float(x) + 0.5) / float(${width_texture}),
            (float(g * height / 2 + y) + 0.5) / float(${height_texture}))
        );
        int index = 0;
        if (xOffset == 0 && yOffset == 0) {
            return pixels[0];
        }
        else if (xOffset == 1 && yOffset == 0) {
            return pixels[1];
        }
        else if (xOffset == 0 && yOffset == 1) {
            return pixels[2];
        }
        return pixels[3];
    }

    // start函数
    void main(void) {
        float res = (-1.0 / exp(-20.0));
        // 获取output的坐标
        ivec4 out_pos = getOutputTensorPos();
        // int b = out_pos[0];
        // int c = out_pos[1];
        // int y = out_pos[2];
        // int x = out_pos[3];
        // X、Y方向的移动步长
        int count_pool = 0;
        int oy_base = out_pos[2] * ${stride_v} - ${padTop};
        int ox_base = out_pos[3] * ${stride_h} - ${padLeft};

        for (int fy = 0; fy < ${pool.height_shape}; fy++) {
            int oy = oy_base + fy;
            if (oy >= ${origin.height_shape}) {
                break;
            }
            if (oy < 0) {
                continue;
            }
            for (int fx = 0; fx < ${pool.width_shape}; fx++) {
                int ox = ox_base + fx;
                if (ox >= ${origin.width_shape}) {
                    break;
                }
                if (ox < 0) {
                    continue;
                }
                // origin数据
                float curr = getValueFromTensorPosPacked_origin(out_pos[0], out_pos[1], oy, ox);
                if (${type_pool} == 1) {
                    if (curr > res) {
                        res = curr;
                    }
                } else {
                    res += curr;
                    // 在平均池化模式忽略填充值(exclusive默认为true）
                    count_pool++;
                }
            }
        }
        if (${type_pool} != 1) {
            res = res / float(count_pool);
        }
        setOutput(res);
    }
    `;
}
export default {
    mainFunc,
    behaviors: [
        'isMax',
        'setPacked',
        'setAdaptive',
        'isGlobalPooling'
    ]
};
