export * from './lib/secure-id.js';
export declare const sparkId: (prefix?: string, config?: Partial<import("./types.js").SparkIdConfig>) => string;
import { SecureId } from './lib/secure-id.js';
declare const _default: {
    generateId: (prefix?: string, config?: Partial<import("./types.js").SparkIdConfig>) => string;
    createId: (prefix?: string, config?: Partial<import("./types.js").SparkIdConfig>) => SecureId;
    isValidId: (id: string, config?: Partial<import("./types.js").SparkIdConfig>) => boolean;
    parseId: (id: string, config?: Partial<import("./types.js").SparkIdConfig>) => {
        prefix?: string;
        id: string;
        full: string;
    };
    sparkId: (prefix?: string, config?: Partial<import("./types.js").SparkIdConfig>) => string;
    SecureId: typeof SecureId;
};
export default _default;
//# sourceMappingURL=spark-id.d.ts.map