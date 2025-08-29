export * from './lib/secure-id.js';
export declare const sparkId: (prefix?: string) => string;
import { SecureId } from './lib/secure-id.js';
declare const _default: {
    generateId: (prefix?: string) => string;
    createId: (prefix?: string) => SecureId;
    isValidId: (id: string) => boolean;
    parseId: (id: string) => {
        prefix?: string;
        id: string;
        full: string;
    };
    sparkId: (prefix?: string) => string;
    SecureId: typeof SecureId;
};
export default _default;
//# sourceMappingURL=spark-id.d.ts.map