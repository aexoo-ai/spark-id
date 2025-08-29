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

// Re-export types from the main module
export type { InvalidIdError, InvalidPrefixError, SecureId, SparkIdError } from './lib/secure-id.js';

