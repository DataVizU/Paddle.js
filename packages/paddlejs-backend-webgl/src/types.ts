import type Tensor from '@paddlejs/paddlejs-core/src/opFactory/tensor';
import { OpData } from '@paddlejs/paddlejs-core/src/commons/interface';

interface Query {
    name: string;
    query: WebGLQuery;
    count: number;
}

export {
    Tensor,
    OpData,
    Query
};
