/**
 * Type definitions for Spark-ID
 */
export interface ParsedId {
    prefix?: string;
    id: string;
    full: string;
}
export interface SparkIdConfig {
    alphabet?: string;
    entropyBits?: number;
    length?: number;
    maxPrefixLength?: number;
    separator?: string;
    case?: 'upper' | 'lower' | 'mixed';
    encoding?: 'base32' | 'base64' | 'hex' | 'custom';
    timestamp?: boolean;
    machineId?: string | number;
}
export interface SparkIdOptions {
    prefix?: string;
    config?: Partial<SparkIdConfig>;
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
export declare const DEFAULT_CONFIG: SparkIdConfig;
export type { InvalidIdError, InvalidPrefixError, SecureId, SparkIdError, } from './lib/secure-id.js';
//# sourceMappingURL=types.d.ts.map