/**
 * Type definitions for Spark-ID
 */
export interface ParsedId {
    prefix?: string;
    id: string;
    full: string;
}
export interface SparkIdOptions {
    prefix?: string;
    length?: number;
}
export interface SparkIdValidationResult {
    isValid: boolean;
    error?: string;
    code?: string;
}
export interface SparkIdStats {
    entropyBits: number;
    collisionProbability: number;
    maxIds: number;
}
export type { SecureId } from './lib/secure-id.js';
export type { SparkIdError, InvalidPrefixError, InvalidIdError } from './lib/secure-id.js';
//# sourceMappingURL=types.d.ts.map